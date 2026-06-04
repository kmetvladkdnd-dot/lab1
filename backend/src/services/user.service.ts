import crypto from "crypto";
import { userRepository } from "../repositories/user.repository";
import { CreateUserDto, UpdateUserDto, UserResponseDto, PaginatedResponse } from "../dtos";
import { ApiError } from "../utils/ApiError";

export class UserService {
  getAll(page: number = 1, limit: number = 10, nameFilter?: string): PaginatedResponse<UserResponseDto> {
    let users = userRepository.getAll();
    if (nameFilter) {
      users = users.filter(u => u.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    const startIndex = (page - 1) * limit;
    const paginatedItems = users.slice(startIndex, startIndex + limit);
    return { items: paginatedItems, total: users.length, page, limit };
  }

  getById(id: string): UserResponseDto {
    const user = userRepository.getById(id);
    if (!user) throw new ApiError(404, "NOT_FOUND", "User not found");
    return user;
  }

  create(dto: CreateUserDto): UserResponseDto {
    const errors: any[] = [];
    if (!dto.name || dto.name.trim().length < 2) errors.push({ field: "name", message: "Min 2 chars" });
    if (!dto.email || !dto.email.includes("@")) errors.push({ field: "email", message: "Valid email required" });
    if (errors.length > 0) throw new ApiError(400, "VALIDATION_ERROR", "Invalid input", errors);

    const newUser: UserResponseDto = { id: crypto.randomUUID(), name: dto.name, email: dto.email };
    userRepository.add(newUser);
    return newUser;
  }

  update(id: string, dto: UpdateUserDto): UserResponseDto {
    const user = this.getById(id);
    if (dto.name) user.name = dto.name;
    if (dto.email) user.email = dto.email;
    userRepository.update(id, user);
    return user;
  }

  delete(id: string): void {
    const success = userRepository.delete(id);
    if (!success) throw new ApiError(404, "NOT_FOUND", "User not found");
  }
}
export const userService = new UserService();