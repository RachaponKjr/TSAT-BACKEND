FROM node:18

WORKDIR /app

# คัดลอกไฟล์ที่จำเป็น และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอก Prisma Client ที่ generate ไว้แล้วจากเครื่อง
COPY prisma ./prisma
COPY node_modules/.prisma node_modules/.prisma

# คัดลอก source code (หลังจาก prisma)
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3130

CMD ["node", "dist/index.js"]
