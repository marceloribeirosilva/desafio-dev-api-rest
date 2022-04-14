import { NextFunction, Request, Response } from 'express';
import { verify, decode } from 'jsonwebtoken';
import authConfig from '../../../config/auth';
import AppError from '../../../errors/AppError';

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing.', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    verify(token, authConfig.jwt.secret);

    const decoded = decode(token, { json: true });

    if (decoded) {
      if (decoded.cpf) request.cpf = decoded.cpf;
    }

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
