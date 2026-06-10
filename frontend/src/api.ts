export const API_BASE_URL = "http://localhost:3000/api/v1";

export type ApiError = { status: number; message: string; details?: any };
export type PostDto = { id: number; title: string; body: string; authorName?: string };

async function request<T>(path: string, options: RequestInit = {}, timeoutMs = 10000): Promise<T> {
    const url = `${API_BASE_URL}${path}`;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
        response = await fetch(url, { ...options, signal: controller.signal });
    } catch (e: any) {
        throw { status: 0, message: "Помилка мережі/CORS або таймаут", details: String(e) } as ApiError;
    } finally {
        clearTimeout(id);
    }

    if (response.status === 204) return null as unknown as T;

    const rawText = await response.text();
    
    if (!response.ok) {
        let payload: any = null;
        try { payload = JSON.parse(rawText); } catch {}
        throw {
            status: response.status,
            message: payload?.message ?? "HTTP помилка",
            details: payload?.error ?? rawText
        } as ApiError;
    }

    if (!rawText) return null as unknown as T;
    try { return JSON.parse(rawText) as T; } 
    catch { return rawText as unknown as T; }
}

export async function getTickets() { return await request<{data: PostDto[]}>("/posts/with-authors"); }
export async function createTicket(title: string, body: string, userId: number = 1) {
    return await request("/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Demo-UserId": String(userId) },
        body: JSON.stringify({ title, body, userId })
    });
}
export async function deleteTicket(id: number | string) { return await request(`/posts/${id}`, { method: "DELETE" }); }
export async function getTop3TicketsByStatus(status: string) { return await request<{data: PostDto[]}>(`/posts/top3?status=${status}`); }

export async function getUsers() { return await request("/users"); }
export async function createUser(data: unknown) {
    return await request("/users", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
    });
}
export async function updateUser(id: number | string, data: unknown) {
    return await request(`/users/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
    });
}
export async function deleteUser(id: number | string) { return await request(`/users/${id}`, { method: "DELETE" }); }