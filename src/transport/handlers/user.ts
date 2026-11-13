import 'dotenv/config';
import type { Request, Response } from 'express';
import { EmailConflictError, InvalidCredentialsError } from '../../domain/user/entity.js';
import type { UserService } from '../../services/user.types.js';

export function createUserHandlers(service: UserService) {
  function validCredentials(body: unknown): body is { email: string; password: string } {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return false;
    const { email, password } = body as Record<string, unknown>;
    return typeof email === 'string' && email.trim().length > 0
      && typeof password === 'string' && password.length > 0;
  }
  return {
    async me(req: Request, res: Response) {
      if (res.locals.userId === undefined) return res.status(401).json({ error: 'Unauthorized' });
      try {
        const user = await service.getById(res.locals.userId);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });
        return res.json(user);
      } catch {
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
    async refresh(req: Request, res: Response) {
      const refreshToken = req.headers.cookie?.split(';')
      .map(cookie => cookie.trim())
      .find(cookie => cookie.startsWith('refreshToken='))
      ?.slice('refreshToken='.length);
      if (typeof refreshToken !== 'string' || !refreshToken) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }
      try {
        const { accessToken } = await service.refresh(refreshToken);
        res.cookie('accessToken', accessToken, {
          httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: Number(process.env.TOKEN_ACCESS_TIME) * 1000,
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
          httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: Number(process.env.TOKEN_ACCESS_TIME) * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
          path: '/refresh', maxAge: Number(process.env.REFRESH_TOKEN_TIME) * 1000,
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
