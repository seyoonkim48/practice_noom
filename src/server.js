import http from "http";
import Websocket from "ws";
import express from "express";

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

// only http
// const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);

// + Websocket
// http, ws가 함께 3000번 포트에서 열리길 원해서 이렇게 작성함!
// express로 http서버를 만들었고
// http서버 위에 Web Socket Server를 만들었음
// ==> 3000번 포트에서 http와 ws의 req, res를 모두 처리
const handleListen = () => console.log(`Listening on http(|| ws)://localhost:3000`);
const server = http.createServer(app);
const wss = new Websocket.Server({ server });

// fake db
const sockets = []; // 연결이 되면 어디와 연결된 건지를 여기에 저장함. ex)sockets = [chrome, safari];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  console.log("Connected to Browser ✅");
  socket.on("close", () => {
    console.log("Disconnected to Browser ❌");
  });
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    // console.log(message, msg.toString('utf-8'));
    switch(message.type) {
      case "new_message":
        // sockets.forEach((aSocket) => aSocket.send(message.payload));
        sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
        break;
      case "nickname":
        // console.log(message.payload);
        socket["nickname"] = message.payload;
        break;
    }

    // aSocket =>  each browser
    // console.log(msg.toString('utf-8'));
    // socket.send(msg.toString('utf-8')); //-> 이렇게하면 여러 브라우저가 있을 때, 각각 서버와 핑퐁할 뿐 서로의 메세지를 볼 수 없음
    // sockets.forEach((aSocket) => {
    //   aSocket.send(msg.toString('utf-8'));
    // });
  });
  // socket.send("hello!!!!");
});

server.listen(3000, handleListen);