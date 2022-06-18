/*
  Warnings:

  - You are about to drop the column `subCategoryId` on the `Transfers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transfers" DROP CONSTRAINT "Transfers_subCategoryId_fkey";

-- AlterTable
ALTER TABLE "Transfers" DROP COLUMN "subCategoryId";

-- CreateTable
CREATE TABLE "TransfersSubCategory" (
    "id" SERIAL NOT NULL,
    "transfersId" INTEGER NOT NULL,
    "subCategoryId" INTEGER NOT NULL,

    CONSTRAINT "TransfersSubCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransfersSubCategory" ADD CONSTRAINT "TransfersSubCategory_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransfersSubCategory" ADD CONSTRAINT "TransfersSubCategory_transfersId_fkey" FOREIGN KEY ("transfersId") REFERENCES "Transfers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
