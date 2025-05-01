-- CreateTable
CREATE TABLE "CustomerReview" (
    "id" UUID NOT NULL,
    "customerName" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "carModelId" UUID NOT NULL,
    "carSubModelId" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "CustomerReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomerReview" ADD CONSTRAINT "CustomerReview_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReview" ADD CONSTRAINT "CustomerReview_carSubModelId_fkey" FOREIGN KEY ("carSubModelId") REFERENCES "CarSubModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
