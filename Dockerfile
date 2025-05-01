# ใช้ Node.js image
FROM node:18

# ตั้ง working directory
WORKDIR /app

# คัดลอกไฟล์ package ก่อน เพื่อใช้ cache ในการ build
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกทุกไฟล์ source code รวมถึง prisma/schema.prisma
COPY . .

COPY node_modules/.prisma node_modules/.prisma
COPY prisma prisma

# ✅ Build TypeScript
RUN npm run build

# เปิดพอร์ต (ตามที่ใช้ในโปรเจกต์)
EXPOSE 3130

# ✅ รันแอปจาก dist
CMD ["node", "dist/index.js"]
