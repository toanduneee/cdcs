import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getKey } from '../config/jwksClient';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
     res.status(401).json({ error: 'Truy cập bị từ chối: Thiếu Bearer Token' });
     return;
  }

  const token = authHeader.split(' ')[1];

  // Ép cứng RS256 để chống Algorithm Confusion Attack
  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
       res.status(401).json({ error: 'Xác thực thất bại', detail: err.message });
       return;
    }
    
    (req as any).user = decoded;
    next();
  });
};