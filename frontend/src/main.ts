import { getTickets, createTicket } from "./api";
import type { ApiError, PostDto } from "./dtos";

const form = document.getElementById("createForm") as HTMLFormElement;
const tableBody = document.getElementById("itemsTableBody") as HTMLTableSectionElement;
const subjectInput = document.getElementById("subjectInput") as HTMLInputElement;
const statusSelect = document.getElementById("statusSelect") as HTMLSelectElement;
const prioritySelect = document.getElementById("prioritySelect") as HTMLSelectElement;
const messageInput = document.getElementById("messageInput") as HTMLTextAreaElement;
const resetBtn = document.getElementById("resetBtn") as HTMLButtonElement;

const listSection = document.querySelector(".list-section") as HTMLElement;
const statusDiv = document.createElement("div");
statusDiv.style.margin = "10px 0";
statusDiv.style.fontWeight = "bold";
listSection.insertBefore(statusDiv, document.querySelector(".controls"));

function renderStatus(status: "loading" | "empty" | "error" | "success", err?: ApiError) {
    tableBody.innerHTML = "";
    if (status === "loading") {
        statusDiv.textContent = " Завантаження заявок...";
        statusDiv.style.color = "blue";
    } else if (status === "empty") {
        statusDiv.textContent = " Поки що немає заявок.";
        statusDiv.style.color = "gray";
    } else if (status === "error") {
        statusDiv.textContent = ` Помилка (${err?.status}): ${err?.message}`;
        statusDiv.style.color = "red";
    } else {
        statusDiv.textContent = ""; 
    }
}

async function loadTickets() {
    renderStatus("loading");
    try {
        const response = await getTickets();
        const items = response.data; 

        if (!items || items.length === 0) {
            renderStatus("empty");
            return;
        }

        renderStatus("success");
        
        items.forEach((item: PostDto) => {
            const tr = document.createElement("tr");
            
            const tdTitle = document.createElement("td");
            tdTitle.textContent = item.title ?? "Без теми";

            const tdBody = document.createElement("td");
            tdBody.colSpan = 2;
            tdBody.textContent = item.body ?? "Немає повідомлення";

            const tdAuthor = document.createElement("td");
            tdAuthor.textContent = item.authorName ?? "Unknown (User ID: 1)";

            const tdAction = document.createElement("td");
            tdAction.innerHTML = `<button disabled>Видалити</button>`; 

            tr.appendChild(tdTitle);
            tr.appendChild(tdBody);
            tr.appendChild(tdAuthor);
            tr.appendChild(tdAction);
            
            tableBody.appendChild(tr);
        });
    } catch (e) {
        renderStatus("error", e as ApiError);
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitBtn.disabled = true; 
    statusDiv.textContent = "⏳ Створення заявки...";
    statusDiv.style.color = "orange";

    try {
        const title = subjectInput.value;
        const bodyText = `[Статус: ${statusSelect.value}] [Пріоритет: ${prioritySelect.value}] Повідомлення: ${messageInput.value}`;
        
        await createTicket(title, bodyText, 1); 
        
        form.reset();
        await loadTickets(); 
    } catch (e) {
        const err = e as ApiError;
        alert(`Не вдалося створити: ${err.message}`);
        statusDiv.textContent = "";
    } finally {
        submitBtn.disabled = false;
    }
});

resetBtn.addEventListener("click", () => form.reset());

loadTickets();