const socket = io("http://localhost:8000");
const form = document.getElementById("xyz");
const message = document.getElementById("msg");
const messageContainer = document.querySelector(".chat-messages");

const appendMessage = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add("other-message");
  messageElement.classList.add(position);
  messageContainer.appendChild(messageElement);
};
const appendUserMessage = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add("user-message");
  messageElement.classList.add(position);
  messageContainer.appendChild(messageElement);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = message.value;
  appendUserMessage(`You : ${msg}`, "right");
  socket.emit("send", msg);
  message.value = "";
});

do {
  var name = prompt("Please enter your first name...");
} while (!name);

socket.emit("new-user", name);

socket.on("New-Member", (name) => {
  // Corrected event name here
  appendMessage(`${name} joined the chat.`, "right");
});

socket.on("receive", (data) => {
  appendMessage(`${data.name} : ${data.message}`, "left");
});

socket.on("left", (name) => {
  appendMessage(`${name} left the chat`, "left");
});
