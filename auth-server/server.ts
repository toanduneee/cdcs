import express from 'express';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// ============================================================================
// 1. KHỞI TẠO VÀ QUẢN LÝ KHÓA (Mục 2.2.1 & 2.2.2 chuyên đề)
// ============================================================================

// Sinh cặp khóa RSA 2048-bit an toàn
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

// Định danh duy nhất cho khóa (Key ID) - Rất quan trọng cho cơ chế xoay vòng khóa
const KID = 'rsa-2026-06-primary';

// Trích xuất các tham số công khai (n, e) để tạo JSON Web Key (JWK)
const publicJwk = crypto.createPublicKey(publicKey).export({ format: 'jwk' });
const jwk = {
    ...publicJwk,
    kid: KID,
    use: 'sig',
    alg: 'RS256'
};

// ============================================================================
// 2. API CẤP PHÁT ĐỊNH DANH - IDENTITY PROVIDER (Mục 2.3.3 chuyên đề)
// ============================================================================

app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    // Giả lập truy vấn cơ sở dữ liệu (Hardcode cho lab)
    if (username !== 'admin' || password !== 'password123') {
        return res.status(401).json({ error: 'Sai thông tin đăng nhập' });
    }

    // Đóng gói Claims và Ký số JWT bằng Private Key
    const payload = {
        sub: 'user_AT200358', // Định danh user
        roles: ['ADMIN']      // Đặc quyền
    };

    const token = jwt.sign(payload, privateKey, {
        algorithm: 'RS256', // Bắt buộc dùng thuật toán bất đối xứng
        keyid: KID,         // Gắn KID vào Header để Resource Server nhận diện
        expiresIn: '15m',   // Thời gian sống ngắn để bảo mật (Mục 1.2.3)
        issuer: 'http://localhost:3000',
        audience: 'my-resource-server'
    });

    res.json({
        access_token: token,
        token_type: 'Bearer',
        expires_in: 900
    });
});

// ============================================================================
// 3. ENDPOINT PHÂN PHỐI KHÓA CÔNG KHAI - JWKS (Mục 2.2.2 chuyên đề)
// ============================================================================

app.get('/.well-known/jwks.json', (req: Request, res: Response) => {
    // Chỉ phơi bày cấu trúc JWK, tuyệt đối không chứa thành phần Private Key
    // Set Header Cache-Control để Resource Server lưu đệm
    res.set('Cache-Control', 'public, max-age=300');
    res.json({
        keys: [jwk]
    });
});

// ============================================================================
// KHỞI ĐỘNG MÁY CHỦ
// ============================================================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`[Auth Server] Đang chạy tại http://localhost:${PORT}`);
    console.log(`[JWKS Endpoint] Sẵn sàng tại http://localhost:${PORT}/.well-known/jwks.json`);
});