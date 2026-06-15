import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const app = express();

// ============================================================================
// 1. CẤU HÌNH JWKS CLIENT (Mục 2.4.2 chuyên đề)
// ============================================================================
// Cấu hình để tải Public Key từ Auth Server.
// Bật 'cache: true' giúp Server không phải gọi lại Auth Server ở mỗi Request.
const client = jwksClient({
  jwksUri: 'http://localhost:3000/.well-known/jwks.json',
  cache: true,
  cacheMaxAge: 300_000, // Lưu đệm trong 5 phút
  rateLimit: true,
});

// Hàm hỗ trợ lấy Public Key dựa vào 'kid' nằm trên Header của Token
function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err || !key) {
      return callback(err || new Error('Không tìm thấy khóa công khai khớp với kid này'));
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// ============================================================================
// 2. MIDDLEWARE XÁC THỰC PHI TRẠNG THÁI (Mục 2.4.1 & 2.4.3 chuyên đề)
// ============================================================================
const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
     res.status(401).json({ error: 'Truy cập bị từ chối: Thiếu Bearer Token' });
     return;
  }

  const token = authHeader.split(' ')[1];

  // Xác minh chữ ký số
  // Lưu ý quan trọng: Ép cứng thuật toán ['RS256'] để chống Algorithm Confusion Attack
  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
       res.status(401).json({ 
        error: 'Xác thực thất bại', 
        detail: err.message 
      });
      return;
    }
    
    // Nếu chữ ký hợp lệ, gắn dữ liệu giải mã được vào request và cho đi tiếp
    (req as any).user = decoded;
    next();
  });
};

// ============================================================================
// 3. API TÀI NGUYÊN BẢO MẬT
// ============================================================================
app.get('/api/secret-data', verifyToken, (req: Request, res: Response) => {
  res.json({
    message: 'Thành công! Chữ ký RSA hoàn toàn hợp lệ.',
    data: 'Đây là dữ liệu mật của hệ thống.',
    user_info: (req as any).user // Trả ra thông tin định danh (ví dụ: user_AT200358)
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`[Resource Server] Đang chạy tại http://localhost:${PORT}`);
});