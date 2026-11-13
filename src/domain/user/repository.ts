import type { Credentials, User } from './entity.js';

export interface UserRepository {
  getById(id: number): Promise<User | undefined>;
  getByEmail(email: string): Promise<User | undefined>;
  create(user: Credentials): Promise<User>;
}
