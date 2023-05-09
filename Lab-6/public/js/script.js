const socket = io();
const chatMessages = document.querySelector(".chat-messages");
const messageForm = document.querySelector(".message-form");
const messageInput = document.querySelector("input[name='message']");
const typingIndicator = document.querySelector(".typing-indicator");
const userList = document.querySelector(".users");

const sendPmBtn = document.getElementById("send-pm");
const viewPmBtn = document.getElementById("view-pm");
const sendPmModal = document.getElementById("send-pm-modal");
const viewPmModal = document.getElementById("view-pm-modal");
const sendPmForm = document.getElementById("send-pm-form");
const recipientSelect = document.getElementById("recipient");
const privateMessagesList = document.getElementById("private-messages");
const closeBtns = document.getElementsByClassName("close");

const username = new URLSearchParams(window.location.search).get("username");
const room = new URLSearchParams(window.location.search).get("room");
const roomNameElement = document.querySelector("#room-name");
let typingTimeout;

socket.on("message", (message) => {
  displayMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("roomUsers", ({ room, users }) => {
  roomNameElement.innerText = room;

  userList.innerHTML = users
    .map(
      (user) => `<li class="${
        user.username === username ? "current-user" : ""
      }">
          <span>
          ${user.username}
          </span>
          <span class="typing-status" data-user-id="${user.id}"></span>
        </li>`
    )
    .join("");
});

socket.on("privateMessage", (message) => {
  displayPrivateMessage(message);
});

socket.emit("joinRoom", { username, room });

socket.on("typing", ({ userId, isTyping }) => {
  const typingStatusElement = document.querySelector(
    `[data-user-id="${userId}"]`
  );

  if (typingStatusElement) {
    typingStatusElement.innerText = isTyping ? "typing..." : "";
  }
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = messageInput.value;

  if (message.trim() !== "") {
    socket.emit("chatMessage", message);
    messageInput.value = "";
    messageInput.focus();
  }
});

sendPmBtn.onclick = () => {
  sendPmModal.style.display = "block";
  const roomUsers = Array.from(userList.children);
  roomUsers.forEach((userElement) => {
    const user = userElement.querySelector("span").innerText;
    if (user !== username) {
      const option = document.createElement("option");
      option.value = user;
      option.innerText = user;
      recipientSelect.appendChild(option);
    }
  });
};

viewPmBtn.onclick = () => {
  viewPmModal.style.display = "block";
  socket.emit("getPrivateMessages");
};

Array.from(closeBtns).forEach((btn) => {
  btn.onclick = () => {
    sendPmModal.style.display = "none";
    viewPmModal.style.display = "none";
  };
});

window.onclick = (event) => {
  if (event.target === sendPmModal || event.target === viewPmModal) {
    sendPmModal.style.display = "none";
    viewPmModal.style.display = "none";
  }
};

sendPmForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const recipientUsername = recipientSelect.value;
  const privateMessage = document.getElementById("private-message").value;

  if (privateMessage.trim() !== "") {
    socket.emit("sendPrivateMessage", {
      recipient: recipientUsername,
      message: privateMessage,
    });
    document.getElementById("private-message").value = "";
    sendPmModal.style.display = "none";
  }
});

function displayPrivateMessage(message) {
  const li = document.createElement("li");
  li.innerHTML = `<span style="color: green;">${message.sender}</span>: ${message.text}`;
  privateMessagesList.appendChild(li);
}

messageInput.addEventListener("input", () => {
  clearTimeout(typingTimeout);
  socket.emit("typing", true);

  typingTimeout = setTimeout(() => {
    socket.emit("typing", false);
  }, 1000);
});

function displayMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p><p class="text">${message.text}</p>`;
  chatMessages.appendChild(div);
}

socket.on("typing", (data) => {
  typingIndicator.innerHTML = data.isTyping
    ? `${data.username} is typing...`
    : "";
});

socket.on("privateMessages", (messages) => {
  privateMessagesList.innerHTML = "";
  messages.forEach(displayPrivateMessage);
});
