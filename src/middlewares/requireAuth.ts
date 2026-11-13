import type { RequestHandler } from 'express';

export function createRequireAuth(verifyAccessToken: (token: string) => number): RequestHandler {
  return (req, res, next) => {
    const accessToken = req.headers.cookie?.split(';')
      .map(cookie => cookie.trim())
      .find(cookie => cookie.startsWith('accessToken='))
      ?.slice('accessToken='.length);
    if (typeof accessToken !== 'string' || !accessToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      res.locals.userId = verifyAccessToken(accessToken);
    } catch {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };
}
