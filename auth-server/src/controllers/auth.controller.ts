// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import { privateKey, KID } from '../config/keys';
// import { pool } from '../config/db'; // Đảm bảo bạn đã tạo file db.ts như ở bước trước

// export const login = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { username, password } = req.body;

//         // 1. Tìm user trong database
//         const [userRows]: any = await pool.query(
//             'SELECT id, username, password, is_active FROM users WHERE username = ?', 
//             [username]
//         );

//         if (userRows.length === 0) {
//             res.status(401).json({ error: 'Tài khoản không tồn tại' });
//             return;
//         }

//         const user = userRows[0];

//         // 2. Kiểm tra tài khoản có bị khóa không
//         if (!user.is_active) {
//             res.status(403).json({ error: 'Tài khoản đã bị vô hiệu hóa' });
//             return;
//         }

//         // 3. So sánh mật khẩu trực tiếp (Plaintext)
//         if (password !== user.password) {
//             res.status(401).json({ error: 'Sai mật khẩu' });
//             return;
//         }

//         // 4. Lấy danh sách quyền (Roles) của user này
//         const [roleRows]: any = await pool.query(`
//             SELECT r.name 
//             FROM roles r
//             JOIN user_roles ur ON r.id = ur.role_id
//             WHERE ur.user_id = ?
//         `, [user.id]);

//         const roles = roleRows.map((r: any) => r.name);

//         // 5. Cấp phát JWT
//         const payload = {
//             sub: `user_AT${user.id}`, // Tạo định danh từ ID Database
//             roles: roles
//         };

//         const token = jwt.sign(payload, privateKey, {
//             algorithm: 'RS256',
//             keyid: KID,
//             expiresIn: '15m',
//             issuer: 'http://localhost:3000',
//             audience: 'my-resource-server'
//         });

//         res.json({
//             access_token: token,
//             token_type: 'Bearer',
//             expires_in: 900
//         });

//     } catch (error) {
//         console.error('Lỗi đăng nhập:', error);
//         res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
//     }
// };


import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { privateKey, KID } from '../config/keys';

export const login = (req: Request, res: Response): void => {
    const { username, password } = req.body;

    // Hardcode tạm thời để test Postman
    if (username !== 'test' || password !== '123456') {
        res.status(401).json({ error: 'Sai thông tin đăng nhập' });
        return;
    }

    const payload = {
        sub: 'user_AT200358',
        roles: ['USER']
    };

    const token = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        keyid: KID,
        expiresIn: '15m',
        issuer: 'http://localhost:3000',
        audience: 'my-resource-server'
    });

    res.json({
        access_token: token,
        token_type: 'Bearer',
        expires_in: 900
    });
};