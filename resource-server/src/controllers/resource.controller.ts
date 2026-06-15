import { Request, Response } from 'express';

export const getSecretData = (req: Request, res: Response) => {
  res.json({
    message: 'Thành công! Chữ ký RSA hoàn toàn hợp lệ.',
    data: 'Đây là dữ liệu mật của hệ thống.',
    user_info: (req as any).user
  });
};