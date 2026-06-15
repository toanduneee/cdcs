# Sử dụng môi trường Node.js gọn nhẹ
FROM node:20-alpine

# Cài đặt thư mục làm việc trong container
WORKDIR /app

# Copy file cấu hình và cài đặt thư viện trước (tối ưu cache)
COPY package*.json ./
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Lệnh khởi chạy server
CMD ["npx", "ts-node", "src/server.ts"]