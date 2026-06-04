export interface PostDto {
    id: number;
    title: string;
    body: string;
    authorName?: string; // Це підтягнеться з твого JOIN-запиту
}

export interface ApiError {
    status: number;
    message: string;
    details?: string;
}