FROM node:20-alpine

WORKDIR /app

# 🏎️ 1. ติดตั้ง Chromium และ Library ที่จำเป็นสำหรับรันเบราว์เซอร์บน Alpine
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# 🏎️ 2. บังคับให้ Puppeteer ใช้ Chromium ของระบบ (แทนการโหลดตัวใหม่ขนาดยักษ์มาเอง)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# คัดลอกไฟล์ package และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอก Prisma schema เข้ามา
COPY prisma ./prisma

# สร้าง Prisma Client ภายใน container
RUN npx prisma generate

# คัดลอก source code ที่เหลือ
COPY . .

# สร้าง TypeScript เป็น JavaScript
RUN npm run build

EXPOSE 3130

CMD ["node", "dist/index.js"]