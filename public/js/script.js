const urlparams = new URLSearchParams(window.location.search);
const room = urlparams.get("room");
const username = urlparams.get("username");

const chatMessages = document.querySelector(".chat-messages");
const chatForm = document.getElementById("chat-form");
const userList = document.getElementById("users");
const roomName = document.getElementById("room-name");

const socket = io();

//this is used to send a message to server that a new socket wants to join with username and room
socket.emit("letMeJoin", { username, room });

socket.on("message", (msg) => {
  console.log(msg);
  showMessage(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

const showMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
  <div class="meta">
  <div class="sender-circle">${message?.name.charAt(0)}</div>
  <div class="sender-info">
      <p class="name">${message?.name}</p>
      <p class="time">${message?.time}</p>
  </div>
</div>
<p class="text">${message?.text}</p>
      `;

  chatMessages.appendChild(div);
};

//get the users in the room
socket.on("userList", ({ room, users }) => {
  roomName.innerText = room;
  userList.innerHTML = `
  ${users?.map((user) => `<li>${user.username}</li>`).join("")}
  `;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
});
