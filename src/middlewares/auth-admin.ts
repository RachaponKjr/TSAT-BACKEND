import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

// ✅ 1. กำหนดลำดับสิทธิ์ที่ครอบคลุม (ให้ MECHANIC อยู่เหนือ USER หรือเทียบเท่าตามดีไซน์ระบบ)
const ROLE_HIERARCHY = {
  USER: 1,
  MECHANIC: 2, // 🛠️ เพิ่มช่างเข้ามาในระบบขั้นบันได
  ADMIN: 3,
  OWNER: 4
};

// ดึง token จาก header หรือ cookie
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

// ตรวจสอบว่าบทบาทผู้ใช้มีสิทธิ์เพียงพอหรือไม่
const hasRequiredRole = (userRole: string, requiredRole: string): boolean => {
  const userLevel =
    ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0;
  const requiredLevel =
    ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 0;
  return userLevel >= requiredLevel;
};

// 🔒 Middleware หลัก: ตรวจสอบและถอดรหัส Token
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

// 🎯 ฟังก์ชันหลักสำหรับเช็กสิทธิ์แบบเจาะจง (Dynamic Role Guard)
export const requireRole = (requiredRole: keyof typeof ROLE_HIERARCHY) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !hasRequiredRole(req.user.role, requiredRole)) {
      res.status(403).json({
        message: `Access Denied. ${requiredRole} role or higher required.`
      });
      return;
    }
    next();
  };
};

// ✅ 2. ปรับตัวเช็กสิทธิ์แต่ละระดับให้เรียกใช้ requireRole (โค้ดสะอาดขึ้น ปลอดภัยขึ้น)
export const isUser = requireRole('USER');
export const isMechanic = requireRole('MECHANIC'); // ADMIN และ OWNER จะผ่านสิทธิ์นี้ได้ด้วยอัตโนมัติ
export const isAdmin = requireRole('ADMIN'); // OWNER จะผ่านได้ด้วย
export const isOwner = requireRole('OWNER'); // เฉพาะ OWNER เท่านั้น

// ✅ 3. ปรับปรุงการเช็ก "เจ้าของข้อมูล หรือ แอดมิน" ให้ปลอดภัยขึ้น
export const isOwnerOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userId = req.params.userId || req.body.userId;
  const currentUserId = req.user.id;
  const userRole = req.user.role;

  // ป้องกันเรื่อง Type (เช่น String vs Number) โดยแปลงเป็น String ก่อนเทียบ
  const isResourceOwner = String(currentUserId) === String(userId);
  const isAdminOrHigher = hasRequiredRole(userRole, 'ADMIN');

  if (isResourceOwner || isAdminOrHigher) {
    next();
    return;
  }

  res.status(403).json({
    message: 'Access Denied. Must be resource owner or have admin privileges.'
  });
};

export { ROLE_HIERARCHY, hasRequiredRole };
