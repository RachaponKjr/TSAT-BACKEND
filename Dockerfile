# ใช้ Node.js image
FROM node:18

# ตั้ง working directory
WORKDIR /app

# คัดลอก package.json และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอก source code ทั้งหมด
COPY . .

# build TypeScript
RUN npm run build

# เปิดพอร์ต (ตามที่ใช้)
EXPOSE 3130

# รันแอปจาก dist
CMD ["node", "dist/index.js"]