const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

const socket = new WebSocket(`ws://${window.location.host}`);

// nickname과 payload(message)가 둘 다 웹소켓으로 전달되어야하는 내용이라 구분이 필요함.
// JSON형태로 주고받는 방법을 생각해보자! 하지만 Text로만 전송이 가능하기 때문에 별도의 stringify, parse 과정이 필요하다.
function makeMessage(type, payload) {
  const msg = {type, payload};
  return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
  // console.log("New message: ", message.data);
  // li태그에 메세지 넣고 추가
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected to Server ❌");
});

// setTimeout(() => {
//   socket.send("hello from the Browser!");
// }, 10000);

function handleSubmit (event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  // socket.send(input.value);
  socket.send(makeMessage("new_message", input.value));

  const li = document.createElement("li");
  li.innerText = `You: ${input.value}`;
  messageList.append(li);

  input.value = "";
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);