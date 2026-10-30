import type { Request, Response } from 'express';
import { EmailConflictError, InvalidCredentialsError } from '../../domain/user/entity.js';
import type { UserService } from '../../services/user.types.js';

export function createUserHandlers(service: UserService) {
  function validCredentials(body: unknown): body is { email: string; password: string } {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return false;
    const { email, password } = body as Record<string, unknown>;
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      && typeof password === 'string' && password.length > 0;
  }
  return {
    async refresh(req: Request, res: Response) {
      const cookie = req.headers.cookie?.split(';').map(value => value.trim())
        .find(value => value.startsWith('refreshToken='));
      if (!cookie) return res.status(401).json({ error: 'Invalid refresh token' });
      try {
        const { accessToken } = await service.refresh(cookie.slice('refreshToken='.length));
        res.cookie('accessToken', accessToken, {
          httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 15 * 60 * 1000,
        });
        return res.json({ message: 'Access token refreshed' });
      } catch (error) {
        if (error instanceof InvalidCredentialsError) return res.status(401).json({ error: 'Invalid refresh token' });
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
    async register(req: Request, res: Response) {
      if (!validCredentials(req.body)) return res.status(422).json({ error: 'Valid email and password are required' });
      try {
        return res.status(201).json(await service.register(req.body));
      } catch (error) {
        if (error instanceof EmailConflictError) return res.status(409).json({ error: 'Email already exists' });
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
    async login(req: Request, res: Response) {
      if (!validCredentials(req.body)) return res.status(422).json({ error: 'Valid email and password are required' });
      try {
        const { user, accessToken, refreshToken } = await service.login(req.body);
        res.cookie('accessToken', accessToken, {
          httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 15 * 60 * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
          path: '/refresh', maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json(user);
      } catch (error) {
        if (error instanceof InvalidCredentialsError) return res.status(401).json({ error: 'Invalid email or password' });
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
  };
}

export type UserHandlers = ReturnType<typeof createUserHandlers>;
