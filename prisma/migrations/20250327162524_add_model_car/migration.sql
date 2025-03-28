-- CreateTable
CREATE TABLE "CMSHOME" (
    "id" SERIAL NOT NULL,
    "headerTitle" TEXT NOT NULL DEFAULT 'Top Service Auto Technic (TSAT)',
    "headerSubTitle" TEXT NOT NULL DEFAULT 'ศูนย์บริการ ซ่อมบำรุงรักษา รถปอร์เช่ (Porsche) ที่ใหญ่เเละทันสมัยที่สุด การันตีงานซ่อม มากกว่า 1,500 คัน ดูแลรถลูกค้า เหมือนรถเราเอง',
    "headerSlide" TEXT NOT NULL DEFAULT 'รีวิวงาน Service ของ TSAT',
    "headerChooseService" TEXT NOT NULL DEFAULT 'เลือกดูบริการจาก Model Porsche ของท่าน',
    "SubChooseService" TEXT NOT NULL DEFAULT 'TSAT คือที่สุดของการดูแล Porsche ที่ตอบโจทย์ทุกความต้องการของคนรักรถหรู เราคือทีมมืออาชีพที่เชี่ยวชาญด้าน Porsche โดยเฉพาะ ด้วยประสบการณ์ยาวนานและความใส่ใจในทุกรายละเอียด',
    "headerServiceInteresting" TEXT NOT NULL DEFAULT 'เลือกจากบริการที่ท่านสนใจ',
    "SubServiceinIeresting" TEXT NOT NULL DEFAULT 'ปรึกษา',
    "reasonHeader" TEXT NOT NULL DEFAULT 'เหตุผลที่เราเป็นที่1',
    "reasonSub1" TEXT NOT NULL DEFAULT 'TSAT เราเริ่มจากการเป็นผู้ใช้รถ Porsche และรถสมรรถนะสูงที่นำเข้าทั่วไปในสมัยก่อนมานานกว่า 10 ปีและจากผู้ใช้รถ มาสู่ผู้เชี่ยวชาญในการซ่อมบำรุงรักษา ตั้งแต่ปี 2017 จนถึงวันนี้ เราผ่านงานซ่อมรถ Porsche ทุกรุ่นมามากกว่า 1000 คัน เรากล้าการันตีว่าอู่ของเราเป็นอู่ที่มีความมุ่งมั่นจริงใจ ทั้งในด้านคุณภาพงานซ่อม และ ในด้านการให้บริการสำหรับท่านเจ้าของรถ Porsche ทุกท่าน ที่ดีที่สุดในประเทศไทย',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CMSHOME_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "showActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarSubModel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "carModelId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarSubModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryService" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT,
    "detail" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" UUID NOT NULL,
    "serviceName" TEXT NOT NULL,
    "serviceDetail" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" UUID NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarService" (
    "id" UUID NOT NULL,
    "carSubModelId" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" UUID NOT NULL,
    "header" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "facebookLink" VARCHAR(255),
    "lineLink" VARCHAR(255),
    "instagramLink" VARCHAR(255),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogTag" (
    "blogId" UUID NOT NULL,
    "tagId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogTag_pkey" PRIMARY KEY ("blogId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarModel_name_key" ON "CarModel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryService_name_key" ON "CategoryService"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Service_serviceName_key" ON "Service"("serviceName");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "CarSubModel" ADD CONSTRAINT "CarSubModel_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarService" ADD CONSTRAINT "CarService_carSubModelId_fkey" FOREIGN KEY ("carSubModelId") REFERENCES "CarSubModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarService" ADD CONSTRAINT "CarService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogTag" ADD CONSTRAINT "BlogTag_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogTag" ADD CONSTRAINT "BlogTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
