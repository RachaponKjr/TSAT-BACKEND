import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

// ✅ ดึง token จาก header หรือ cookie
const getTokenFromRequest = (req: Request): string | undefined => {
  const authHeader = req.headers['authorization'];
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  if (req.cookies?.access_token) {
    return req.cookies.access_token;
  }

  return undefined;
};

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access Denied. No Token Provided.' });
  }

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or Expired Token' });
  }
};

// ✅ ตรวจสอบว่า user เป็น OWNER เท่านั้น
export const isOwner = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'OWNER') {
    return res.status(403).json({ message: 'Access Denied. Not Owner.' });
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
    return res
      .status(403)
      .json({ message: 'Access Denied. Not Admin or Owner.' });
  }
  next();
};

// ✅ ตรวจสอบว่า user เป็น USER เท่านั้น
export const isUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'USER') {
    return res.status(403).json({ message: 'Access Denied. Not User.' });
  }
  next();
};
