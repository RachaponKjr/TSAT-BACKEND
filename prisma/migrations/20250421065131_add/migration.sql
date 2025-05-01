-- CreateTable
CREATE TABLE "CustomerWork" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "images" TEXT[],
    "carModelId" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "CustomerWork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerWorkTag" (
    "customerWorkId" UUID NOT NULL,
    "tagId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerWorkTag_pkey" PRIMARY KEY ("customerWorkId","tagId")
);

-- AddForeignKey
ALTER TABLE "CustomerWork" ADD CONSTRAINT "CustomerWork_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerWorkTag" ADD CONSTRAINT "CustomerWorkTag_customerWorkId_fkey" FOREIGN KEY ("customerWorkId") REFERENCES "CustomerWork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerWorkTag" ADD CONSTRAINT "CustomerWorkTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
