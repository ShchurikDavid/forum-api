import type { UserRepository } from '../domain/user/repository.js';
import { EmailConflictError } from '../domain/user/entity.js';
import type { db as database } from '../prisma/db.js';

export function createUserRepository(db: typeof database): UserRepository {
  const users = db.orm.public.User;
  return {
    async getById(id) {
      return (await users.where({ id }).first()) ?? undefined;
    },
    async getByEmail(email) {
      return (await users.where({ email }).first()) ?? undefined;
    },
    async create(user) {
      try {
        return await users.create(user);
      } catch (error) {
        // A concurrent registration may have inserted the same email.
        if (await users.where({ email: user.email }).first()) throw new EmailConflictError();
        throw error;
      }
    },
  };
}
