import { API_BASE_URL } from "./config";
import type { ApiError, PostDto } from "./dtos";

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

export async function getTickets() {
    return await request<{data: PostDto[]}>("/posts/with-authors");
}

export async function createTicket(title: string, body: string, userId: number = 1) {
    return await request("/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Demo-UserId": "1"
        },
        body: JSON.stringify({ title, body, userId })
    });
} 