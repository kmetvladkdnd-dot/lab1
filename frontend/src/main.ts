import { getTickets, createTicket, deleteTicket, getUsers, createUser, updateUser, deleteUser, getTop3TicketsByStatus } from "./api";
import type { ApiError, PostDto } from "./api";

const form = document.getElementById("createForm") as HTMLFormElement;
const tableBody = document.getElementById("itemsTableBody") as HTMLTableSectionElement;
const subjectInput = document.getElementById("subjectInput") as HTMLInputElement;
const statusSelect = document.getElementById("statusSelect") as HTMLSelectElement;
const prioritySelect = document.getElementById("prioritySelect") as HTMLSelectElement;
const messageInput = document.getElementById("messageInput") as HTMLTextAreaElement;

const usersTableBody = document.getElementById("usersTableBody") as HTMLTableSectionElement;
const createUserForm = document.getElementById("createUserForm") as HTMLFormElement;
const userNameInput = document.getElementById("userNameInput") as HTMLInputElement;
const userEmailInput = document.getElementById("userEmailInput") as HTMLInputElement;

const top3TableBody = document.getElementById("top3TableBody") as HTMLTableSectionElement;
const getTop3Btn = document.getElementById("getTop3Btn") as HTMLButtonElement;
const top3StatusSelect = document.getElementById("top3StatusSelect") as HTMLSelectElement;

async function loadUsers() {
    if (!usersTableBody) return;
    try {
        const response = await getUsers() as any;
        const users = response.data || response;
        usersTableBody.innerHTML = "";
        
        if (!users || users.length === 0) {
            usersTableBody.innerHTML = "<tr><td colspan='4'>Користувачів не знайдено</td></tr>";
            return;
        }

        users.forEach((user: any) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name ?? "Без імені"}</td>
                <td>${user.email ?? "-"}</td>
            `;
            const tdAction = document.createElement("td");
            
            const editBtn = document.createElement("button");
            editBtn.textContent = "Редагувати";
            editBtn.onclick = async () => {
                const newName = prompt("Нове ім'я:", user.name);
                const newEmail = prompt("Новий email:", user.email);
                if (newName && newEmail) {
                    await updateUser(user.id, { name: newName, email: newEmail });
                    await loadUsers();
                }
            };

            const delBtn = document.createElement("button");
            delBtn.textContent = "Видалити";
            delBtn.onclick = async () => {
                if (confirm("Видалити користувача?")) {
                    await deleteUser(user.id);
                    await loadUsers();
                }
            };
            tdAction.appendChild(editBtn); tdAction.appendChild(delBtn); tr.appendChild(tdAction);
            usersTableBody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

async function loadTickets() {
    if (!tableBody) return;
    try {
        const response = await getTickets();
        const items = response.data; 
        tableBody.innerHTML = "";

        if (!items || items.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='5'>Заявок немає</td></tr>";
            return;
        }
        
        items.forEach((item: PostDto) => {
            const tr = document.createElement("tr");
            const statusMatch = item.body.match(/\[Статус: (.*?)\]/);
            const priorityMatch = item.body.match(/\[Пріоритет: (.*?)\]/);
            
            tr.innerHTML = `
                <td>${item.title ?? "Без теми"}</td>
                <td>${statusMatch ? statusMatch[1] : "-"}</td>
                <td>${priorityMatch ? priorityMatch[1] : "-"}</td>
                <td>${item.authorName ?? `ID: ${item.id}`}</td>
            `;

            const tdAction = document.createElement("td");
            const delBtn = document.createElement("button");
            delBtn.textContent = "Видалити";
            delBtn.onclick = async () => {
                if (confirm("Видалити заявку?")) {
                    await deleteTicket(item.id);
                    await loadTickets();
                }
            };
            tdAction.appendChild(delBtn); tr.appendChild(tdAction);
            tableBody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const bodyText = `[Статус: ${statusSelect.value}] [Пріоритет: ${prioritySelect.value}] Повідомлення: ${messageInput.value}`;
        await createTicket(subjectInput.value, bodyText, 1); 
        form.reset(); await loadTickets(); 
    } catch (e: any) { alert(`Помилка: ${e.message}`); }
});

createUserForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        await createUser({ name: userNameInput.value, email: userEmailInput.value });
        createUserForm.reset(); await loadUsers();
    } catch (e: any) { alert(`Помилка: ${e.message}`); }
});

getTop3Btn?.addEventListener("click", async () => {
    if (!top3TableBody) return;
    top3TableBody.innerHTML = "<tr><td colspan='2'>⏳...</td></tr>";
    try {
        const response = await getTop3TicketsByStatus(top3StatusSelect.value);
        top3TableBody.innerHTML = "";
        if (!response.data || response.data.length === 0) {
            top3TableBody.innerHTML = "<tr><td colspan='2'>Нічого не знайдено</td></tr>";
            return;
        }
        response.data.forEach((item: PostDto) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${item.title}</td><td>${item.body}</td>`;
            top3TableBody.appendChild(tr);
        });
    } catch (e: any) { alert(`Помилка: ${e.message}`); }
});

loadTickets();
loadUsers();