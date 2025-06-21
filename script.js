let tasks = [];

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dueInput = document.getElementById("dueInput");

  const taskText = taskInput.value.trim();
  const dueDate = dueInput.value;

  if (!taskText || !dueDate) return alert("Please enter task and due time.");

  tasks.push({
    text: taskText,
    due: new Date(dueDate),
    done: false
  });

  taskInput.value = "";
  dueInput.value = "";
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.sort((a, b) => new Date(a.due) - new Date(b.due));

  const now = new Date();
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";

    const span = document.createElement("span");
    span.innerHTML = `${task.text} <small>(Due: ${new Date(task.due).toLocaleString()})</small>`;
    span.onclick = () => toggleDone(i);

    const delBtn = document.createElement("button");
    delBtn.innerText = "❌";
    delBtn.onclick = () => deleteTask(i);

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);

    // 🕓 Reminder alert 1 minute before due
    if (!task.done && new Date(task.due) - now <= 60000 && new Date(task.due) > now) {
      alert(`Reminder: "${task.text}" is due soon!`);
      showNotification(task.text);
    }
  });

  updateStats();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function filterTasks() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const items = document.querySelectorAll("#taskList li");
  items.forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.display = text.includes(query) ? "" : "none";
  });
}

function updateStats() {
  const stats = document.getElementById("stats");
  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;
  const overdue = tasks.filter(t => !t.done && new Date(t.due) < new Date()).length;
  stats.innerHTML = `📊 Total: ${total} | ✅ Done: ${completed} | ⏰ Overdue: ${overdue}`;
}

function showNotification(text) {
  if (Notification.permission === "granted") {
    new Notification("To-Do Reminder", { body: text });
  }
}

// Ask for notification permission
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Check for due reminders every 30 seconds
setInterval(renderTasks, 30000);
