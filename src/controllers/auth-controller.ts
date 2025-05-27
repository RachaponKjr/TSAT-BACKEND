import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const checkTokenStatus = (req: Request, res: Response) => {
  try {
    const token =
      req.header('Authorization')?.replace('Bearer ', '') ||
      req.headers['x-access-token'] ||
      req.cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided',
        isValid: false
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ตรวจสอบว่า token จะหมดอายุเมื่อไหร่
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - currentTime;

    res.json({
      success: true,
      message: 'Token is valid',
      isValid: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      },
      expiresIn: timeUntilExpiry,
      expiresAt: new Date(decoded.exp * 1000)
    });
    return;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token expired',
        isValid: false,
        expired: true
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Invalid token',
      isValid: false
    });
    return;
  }
};

export { checkTokenStatus };
