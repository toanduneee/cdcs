import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';

export const client = jwksClient({
  jwksUri: process.env.JWKS_URL || 'http://localhost:3000/.well-known/jwks.json',
  cache: true,
  cacheMaxAge: 300_000,
  rateLimit: true,
});

export function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err || !key) {
      return callback(err || new Error('Không tìm thấy khóa công khai khớp với kid này'));
    }
    callback(null, key.getPublicKey());
  });
}