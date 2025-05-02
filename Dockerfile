FROM node:18

WORKDIR /app

# คัดลอกไฟล์ package และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอก Prisma schema เข้ามา
COPY prisma ./prisma

# ✅ สร้าง Prisma Client ภายใน container
RUN npx prisma generate

# คัดลอก source code ที่เหลือ
COPY . .

# สร้าง TypeScript เป็น JavaScript
RUN npm run build

EXPOSE 3130

CMD ["node", "dist/index.js"]
