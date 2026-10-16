const STORAGE_KEY = "local-web-chat-messages-v1";
const messagesEl = document.querySelector("#messages");
const welcomeEl = document.querySelector("#welcome");
const form = document.querySelector("#chatForm");
const input = document.querySelector("#messageInput");
const sendButton = document.querySelector("#sendButton");
const newChatButton = document.querySelector("#newChatButton");
let messages = loadMessages();

function loadMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch { return []; }
}
function saveMessages() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); }
  catch (error) { console.warn("Could not save chat history in this browser.", error); }
}
function renderMessage(message) {
  const row = document.createElement("article");
  row.className = `message-row ${message.role}`;
  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = message.role === "user" ? "Y" : "L";
  const content = document.createElement("div");
  content.className = "message-content";
  const meta = document.createElement("div");
  meta.className = "message-meta";
  meta.textContent = message.role === "user" ? "You" : "LocalChat";
  const text = document.createElement("div");
  text.className = "message-text";
  // Display user content as text, never as HTML.
  text.textContent = message.text;
  content.append(meta, text);
  row.append(avatar, content);
  messagesEl.append(row);
}
function renderAll() {
  messagesEl.replaceChildren();
  if (!messages.length) {
    messagesEl.append(welcomeEl);
    welcomeEl.hidden = false;
    return;
  }
  welcomeEl.hidden = true;
  messages.forEach(renderMessage);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
function addMessage(role, text) {
  messages.push({ role, text, createdAt: new Date().toISOString() });
  saveMessages();
  renderAll();
}
function localReply(userText) {
  const text = userText.toLowerCase();
  if (text.includes("how") && (text.includes("work") || text.includes("app"))) {
    return "This starter app uses HTML, CSS, and JavaScript. Your messages are saved in this browser with localStorage. It does not connect different users or use an AI service yet. A backend and authentication can be added in a later phase.";
  }
  if (text.includes("plan") || text.includes("day")) {
    return "Let's make a simple plan: 1) Choose your top priority. 2) Break it into three small tasks. 3) Set a realistic time for each task. 4) Review what you completed at the end of the day.";
  }
  if (text.includes("project") || text.includes("idea") || text.includes("brainstorm")) {
    return "A good next step is to define the app's requirements: who will use it, whether chats should be one-to-one or group-based, and whether messages must sync across devices. This demo is a front-end starting point; real multi-user chat needs a server.";
  }
  return "Thanks for your message. This is the local demo response, not an AI-generated answer. To make this a real multi-user web chat, the next phase can add a backend, user accounts, and real-time messaging.";
}
function submitMessage(text) {
  const clean = text.trim();
  if (!clean) return;
  addMessage("user", clean);
  input.value = "";
  resizeInput();
  sendButton.disabled = true;
  window.setTimeout(() => {
    addMessage("assistant", localReply(clean));
    sendButton.disabled = false;
    input.focus();
  }, 350);
}
function resizeInput() {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitMessage(input.value);
});
input.addEventListener("input", resizeInput);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => submitMessage(button.dataset.prompt));
});
newChatButton.addEventListener("click", () => {
  messages = [];
  saveMessages();
  renderAll();
  input.focus();
});
renderAll();