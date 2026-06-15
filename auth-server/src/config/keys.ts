import crypto from 'crypto';

// Sinh cặp khóa RSA 2048-bit an toàn
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

export const KID = 'rsa-2026-06-primary';

// Trích xuất JWK
const publicJwk = crypto.createPublicKey(publicKey).export({ format: 'jwk' });
export const jwk = {
    ...publicJwk,
    kid: KID,
    use: 'sig',
    alg: 'RS256'
};

export { privateKey, publicKey };