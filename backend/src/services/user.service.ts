import * as userRepository from "../repositories/user.repository";
import { CreateUserDto, UpdateUserDto } from "../dtos";
import { ApiError } from "../utils/ApiError";

export class UserService {
  async getAll(page: number = 1, limit: number = 10, nameFilter?: string) {
    let users = await userRepository.getAllUsers() as any[];
    if (nameFilter) {
      users = users.filter(u => u.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    const startIndex = (page - 1) * limit;
    const paginatedItems = users.slice(startIndex, startIndex + limit);
    return { data: paginatedItems, total: users.length, page, limit };
  }

  async getById(id: string) {
    const user = await userRepository.getUserById(Number(id));
    if (!user) throw new ApiError(404, "NOT_FOUND", "User not found");
    return user;
  }

  async create(dto: CreateUserDto) {
    const errors: any[] = [];
    if (!dto.name || dto.name.trim().length < 2) errors.push({ field: "name", message: "Min 2 chars" });
    if (!dto.email || !dto.email.includes("@")) errors.push({ field: "email", message: "Valid email required" });
    if (errors.length > 0) throw new ApiError(400, "VALIDATION_ERROR", "Invalid input", errors);

    return await userRepository.createUser(dto.email, dto.name);
  }

  async update(id: string, dto: UpdateUserDto) {
    throw new ApiError(501, "NOT_IMPLEMENTED", "Update not implemented");
  }

  async delete(id: string) {
    throw new ApiError(501, "NOT_IMPLEMENTED", "Delete not implemented");
  }
}
export const userService = new UserService();