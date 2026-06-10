let tickets = loadFromStorage();
let editId = null;

const form = document.getElementById("createForm");
const tbody = document.getElementById("itemsTableBody");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");

renderTable();

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const subject = document.getElementById("subjectInput").value.trim();
  const status = document.getElementById("statusSelect").value;
  const priority = document.getElementById("prioritySelect").value;
  const message = document.getElementById("messageInput").value.trim();
  const author = document.getElementById("authorInput").value.trim();

  const dto = { subject, status, priority, message, author };

  if (validate(dto) === false) {
    return;
  }

  if (editId !== null) {
    const ticket = tickets.find(t => t.id === editId);
    ticket.subject = dto.subject;
    ticket.status = dto.status;
    ticket.priority = dto.priority;
    ticket.message = dto.message;
    ticket.author = dto.author;
    editId = null;
  } else {
    let newId = 1;
    if (tickets.length > 0) {
      let maxId = 0;
      for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].id > maxId) {
          maxId = tickets[i].id;
        }
      }
      newId = maxId + 1;
    }

    dto.id = newId;
    tickets.push(dto);
  }

  saveToStorage();
  renderTable();
  form.reset();
});

document.getElementById("resetBtn").addEventListener("click", function() {
  form.reset();
  clearErrors();
  editId = null;
});

tbody.addEventListener("click", function(event) {
  const target = event.target;
  const id = Number(target.dataset.id);

  if (target.classList.contains("delete-btn")) {
    tickets = tickets.filter(t => t.id !== id);
    saveToStorage();
    renderTable();
  }

  if (target.classList.contains("edit-btn")) {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      document.getElementById("subjectInput").value = ticket.subject;
      document.getElementById("statusSelect").value = ticket.status;
      document.getElementById("prioritySelect").value = ticket.priority;
      document.getElementById("messageInput").value = ticket.message;
      document.getElementById("authorInput").value = ticket.author;
      editId = ticket.id;
      clearErrors();
    }
  }
});

sortSelect.addEventListener("change", renderTable);
searchInput.addEventListener("input", renderTable);

function validate(dto) {
  clearErrors();
  let isValid = true;

  if (dto.subject === "") {
    showError("subjectInput", "subjectError", "Поле обов'язкове");
    isValid = false;
  }
  if (dto.status === "") {
    showError("statusSelect", "statusError", "Оберіть статус");
    isValid = false;
  }
  if (dto.priority === "") {
    showError("prioritySelect", "priorityError", "Оберіть пріоритет");
    isValid = false;
  }
  if (dto.message === "") {
    showError("messageInput", "messageError", "Поле обов'язкове");
    isValid = false;
  }
  if (dto.author === "") {
    showError("authorInput", "authorError", "Поле обов'язкове");
    isValid = false;
  }

  return isValid;
}

function showError(inputId, errorId, message) {
  document.getElementById(inputId).classList.add("invalid");
  document.getElementById(errorId).innerHTML = message;
}

function clearErrors() {
  const invalidFields = document.querySelectorAll(".invalid");
  for (let i = 0; i < invalidFields.length; i++) {
    invalidFields[i].classList.remove("invalid");
  }
  const errorTexts = document.querySelectorAll(".error-text");
  for (let i = 0; i < errorTexts.length; i++) {
    errorTexts[i].innerHTML = "";
  }
}

function saveToStorage() {
  const json = JSON.stringify(tickets);
  localStorage.setItem('state', json);
}

function loadFromStorage() {
  const json = localStorage.getItem('state');
  if (json === null) {
    return [];
  }
  try {
    return JSON.parse(json);
  } catch (error) {
    return [];
  }
}

function renderTable() {
  let displayTickets = [];
  const searchText = searchInput.value.toLowerCase();

  for (let i = 0; i < tickets.length; i++) {
    let t = tickets[i];
    if (t.subject.toLowerCase().includes(searchText)) {
      displayTickets.push(t);
    }
  }

  if (sortSelect.value === "priority") {
    displayTickets.sort(function(a, b) {
      const weight = { "High": 3, "Medium": 2, "Low": 1 };
      return weight[b.priority] - weight[a.priority];
    });
  }

  let html = "";
  for (let i = 0; i < displayTickets.length; i++) {
    let t = displayTickets[i];
    html += `
            <tr>
                <td>${t.subject}</td>
                <td>${t.status}</td>
                <td>${t.priority}</td>
                <td>${t.author}</td>
                <td>
                    <button type="button" class="edit-btn" data-id="${t.id}">Редагувати</button>
                    <button type="button" class="delete-btn" data-id="${t.id}">Видалити</button>
                </td>
            </tr>
        `;
  }
  tbody.innerHTML = html;

}
// document.querySelectorAll('thead th').forEach((th, index) => {
//     let asc = true;
//     th.style.cursor = 'pointer'; 
//     th.addEventListener('click', () => {
//         const tbody = document.getElementById('itemsTableBody');
//         const rows = Array.from(tbody.querySelectorAll('tr'));

//         rows.sort((a, b) => {
//             const valA = a.cells[index].textContent.trim();
//             const valB = b.cells[index].textContent.trim();
//             return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
//         });

//         asc = !asc;
//         tbody.append(...rows);
//     });
// });