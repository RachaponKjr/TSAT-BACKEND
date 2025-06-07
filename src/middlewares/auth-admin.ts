import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
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

// ✅ กำหนดลำดับสิทธิ์
const ROLE_HIERARCHY = {
  USER: 1,
  ADMIN: 2,
  OWNER: 3
};

// ✅ ตรวจสอบว่าบทบาทผู้ใช้มีสิทธิ์เพียงพอหรือไม่
const hasRequiredRole = (userRole: string, requiredRole: string): boolean => {
  const userLevel =
    ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0;
  const requiredLevel =
    ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 0;
  return userLevel >= requiredLevel;
};

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
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

// ✅ ตรวจสอบสิทธิ์ OWNER (เฉพาะ OWNER เท่านั้น)
export const isOwner = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'OWNER') {
    res.status(403).json({ message: 'Access Denied. Owner role required.' });
    return;
  }
  next();
};

// ✅ ตรวจสอบสิทธิ์ ADMIN หรือสูงกว่า (ADMIN, OWNER)
export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!hasRequiredRole(req.user?.role, 'ADMIN')) {
    res
      .status(403)
      .json({ message: 'Access Denied. Admin role or higher required.' });
    return;
  }
  next();
};

// ✅ ตรวจสอบสิทธิ์ USER หรือสูงกว่า (USER, ADMIN, OWNER)
export const isUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!hasRequiredRole(req.user?.role, 'USER')) {
    res
      .status(403)
      .json({ message: 'Access Denied. User role or higher required.' });
    return;
  }
  next();
};

// ✅ ฟังก์ชันเสริม: ตรวจสอบสิทธิ์แบบกำหนดเอง
export const requireRole = (requiredRole: keyof typeof ROLE_HIERARCHY) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!hasRequiredRole(req.user?.role, requiredRole)) {
      res.status(403).json({
        message: `Access Denied. ${requiredRole} role or higher required.`
      });
      return;
    }
    next();
  };
};

// ✅ ตรวจสอบว่าเป็นเจ้าของทรัพยากรหรือมีสิทธิ์ระดับ ADMIN ขึ้นไป
export const isOwnerOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.params.userId || req.body.userId;
  const currentUserId = req.user?.id;
  const userRole = req.user?.role;

  // ถ้าเป็นเจ้าของทรัพยากรเอง หรือมีสิทธิ์ ADMIN ขึ้นไป
  if (currentUserId === userId || hasRequiredRole(userRole, 'ADMIN')) {
    next();
    return;
  }

  res.status(403).json({
    message: 'Access Denied. Must be resource owner or have admin privileges.'
  });
};

// ✅ Export ค่าคงที่สำหรับใช้ในที่อื่น
export { ROLE_HIERARCHY, hasRequiredRole };
