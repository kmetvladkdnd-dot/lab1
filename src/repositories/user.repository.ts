import { UserResponseDto } from "../dtos";

export class UserRepository {
  private users: UserResponseDto[] = [];

  getAll(): UserResponseDto[] { return this.users; }
  getById(id: string): UserResponseDto | undefined { return this.users.find(u => u.id === id); }
  add(user: UserResponseDto): void { this.users.push(user); }
  update(id: string, user: UserResponseDto): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) this.users[index] = user;
  }
  delete(id: string): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) { this.users.splice(index, 1); return true; }
    return false;
  }
}
export const userRepository = new UserRepository();