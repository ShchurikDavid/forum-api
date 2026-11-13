import { EmailConflictError, InvalidCredentialsError } from '../domain/user/entity.js';
import type { UserRepository } from '../domain/user/repository.js';
import type { UserService, PasswordHasher, TokenSigner } from './user.types.js';

export function createUserService(repository: UserRepository, passwordHasher: PasswordHasher, tokenSigner: TokenSigner): UserService {
  return {
    async getById(id) {
      const user = await repository.getById(id);
      return user ? { id: user.id, email: user.email } : undefined;
    },
    async refresh(refreshToken) {
      let userId: number;
      try {
        userId = tokenSigner.verifyRefreshToken(refreshToken);
      } catch {
        throw new InvalidCredentialsError();
      }
      const user = await repository.getById(userId);
      if (!user) throw new InvalidCredentialsError();
      return { accessToken: tokenSigner.signAccessToken(user.id) };
    },
    async register({ email, password }) {
      if (await repository.getByEmail(email)) throw new EmailConflictError();
      const user = await repository.create({ email, password: await passwordHasher.hash(password) });
      return { id: user.id, email: user.email };
    },
    async login({ email, password }) {
      const user = await repository.getByEmail(email);
      if (!user || !await passwordHasher.verify(user.password, password)) throw new InvalidCredentialsError();
      return {
        user: { id: user.id, email: user.email },
        accessToken: tokenSigner.signAccessToken(user.id),
        refreshToken: tokenSigner.signRefreshToken(user.id),
      };
    },
  };
}
