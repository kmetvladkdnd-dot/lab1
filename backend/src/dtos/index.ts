export interface CreateUserDto { name: string; email: string; }
export interface UpdateUserDto { name?: string; email?: string; }
export interface UserResponseDto { id: string; name: string; email: string; }

export interface CreateComponentDto { title: string; type: string; }
export interface UpdateComponentDto { title?: string; type?: string; }
export interface ComponentResponseDto { id: string; title: string; type: string; }

export interface PaginatedResponse<T> { items: T[]; total: number; page: number; limit: number; }