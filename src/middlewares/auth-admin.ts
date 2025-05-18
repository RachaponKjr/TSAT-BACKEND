import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ message: 'Access Denied. No Token Provided.' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or Expired Token' });
    return;
  }
};

export const isOwner = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role !== 'OWNER') {
    res.status(403).json({ message: 'Access Denied. Not Owner.' });
    return;
  }
  next();
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const role = req.user.role;

  if (role !== 'ADMIN' && role !== 'OWNER') {
    res.status(403).json({ message: 'Access Denied. Not Admin or Owner.' });
    return;
  }

  next();
};

export const isUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user.role !== 'USER') {
    res.status(403).json({ message: 'Access Denied. Not User.' });
    return;
  }
  next();
};
