import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { EmailConflictError, InvalidCredentialsError } from '../domain/user/entity.js';
import type { UserRepository } from '../domain/user/repository.js';
import type { UserService } from './user.types.js';

export function createUserService(repository: UserRepository, jwtSecret: string, refreshSecret: string): UserService {
  const createAccessToken = (id: number) => jwt.sign({ sub: String(id) }, jwtSecret, { expiresIn: '15m' });

  return {
    async refresh(refreshToken) {
      let payload: jwt.JwtPayload;
      try {
        const decoded = jwt.verify(refreshToken, refreshSecret, { algorithms: ['HS256'] });
        if (typeof decoded === 'string' || decoded.type !== 'refresh'
          || typeof decoded.sub !== 'string' || !/^[1-9]\d*$/.test(decoded.sub)
          || !Number.isSafeInteger(Number(decoded.sub))) throw new InvalidCredentialsError();
        payload = decoded;
      } catch {
        throw new InvalidCredentialsError();
      }
      const user = await repository.getById(Number(payload.sub));
      if (!user) throw new InvalidCredentialsError();
      return { accessToken: createAccessToken(user.id) };
    },
    async register({ email, password }) {
      if (await repository.getByEmail(email)) throw new EmailConflictError();
      const user = await repository.create({ email, password: await bcrypt.hash(password, 10) });
      return { id: user.id, email: user.email };
    },
    async login({ email, password }) {
      const user = await repository.getByEmail(email);
      if (!user || !await bcrypt.compare(password, user.password)) throw new InvalidCredentialsError();
      return {
        user: { id: user.id, email: user.email },
        accessToken: createAccessToken(user.id),
        refreshToken: jwt.sign({ sub: String(user.id), type: 'refresh' }, refreshSecret, { expiresIn: '7d' }),
      };
    },
  };
}
