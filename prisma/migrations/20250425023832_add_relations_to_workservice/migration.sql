-- CreateTable
CREATE TABLE "WorkService" (
    "id" UUID NOT NULL,
    "image" TEXT NOT NULL,
    "carModelId" UUID NOT NULL,
    "carSubModelId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "WorkService_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkService" ADD CONSTRAINT "WorkService_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkService" ADD CONSTRAINT "WorkService_carSubModelId_fkey" FOREIGN KEY ("carSubModelId") REFERENCES "CarSubModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
