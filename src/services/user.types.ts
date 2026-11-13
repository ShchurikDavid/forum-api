import type { Credentials, PublicUser } from '../domain/user/entity.js';

export interface UserService {
  getById(id: number): Promise<PublicUser | undefined>;
  register(credentials: Credentials): Promise<PublicUser>;
  login(credentials: Credentials): Promise<{ user: PublicUser; accessToken: string; refreshToken: string }>;
  refresh(refreshToken: string): Promise<{ accessToken: string }>;
}

export interface PasswordHasher {
  hash(password: string): Promise<string>;
  verify(hash: string, password: string): Promise<boolean>;
}

export interface TokenSigner {
  signAccessToken(userId: number): string;
  signRefreshToken(userId: number): string;
  verifyRefreshToken(token: string): number;
}
