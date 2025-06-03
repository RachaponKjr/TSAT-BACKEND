import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

// ✅ ดึง token จาก header หรือ cookie
const getTokenFromRequest = (req: Request): string | undefined => {
  const authHeader = req.headers['authorization'];
  if (authHeader?.startsWith('Bearer ')) {
    authHeader.split(' ')[1];
    return;
  }

  if (req.cookies?.access_token) {
    req.cookies.access_token;
    return;
  }

  undefined;
  return;
};

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = getTokenFromRequest(req);

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

// ✅ ตรวจสอบว่า user เป็น OWNER เท่านั้น
export const isOwner = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'OWNER') {
    res.status(403).json({ message: 'Access Denied. Not Owner.' });
    return;
  }
  next();
};

// ✅ ตรวจสอบว่า user เป็น ADMIN หรือ OWNER
export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const role = req.user?.role;
  if (role !== 'ADMIN' && role !== 'OWNER') {
    res.status(403).json({ message: 'Access Denied. Not Admin or Owner.' });
    return;
  }
  next();
};

// ✅ ตรวจสอบว่า user เป็น USER เท่านั้น
export const isUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'USER') {
    res.status(403).json({ message: 'Access Denied. Not User.' });
    return;
  }
  next();
};
