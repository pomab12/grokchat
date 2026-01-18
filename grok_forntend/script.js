async function sendMessage() {
  const inputField = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const message = inputField.value.trim();

  if (message === "") return;

  // Show user message
  chatBox.innerHTML += `<div class="message user"><b>You:</b> ${message}</div>`;
  inputField.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Send to backend
  const response = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ message: message })
  });

  const data = await response.json();

  // Show bot reply
  chatBox.innerHTML += `<div class="message bot"><b>Bot:</b> ${data.reply}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}
