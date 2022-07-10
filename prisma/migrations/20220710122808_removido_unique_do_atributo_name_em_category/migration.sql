-- DropForeignKey
ALTER TABLE "TransfersSubCategory" DROP CONSTRAINT "TransfersSubCategory_transfersId_fkey";

-- DropForeignKey
ALTER TABLE "TransfersSubCategoryPaymentMethod" DROP CONSTRAINT "TransfersSubCategoryPaymentMethod_transfersSubCategoryId_fkey";

-- DropIndex
DROP INDEX "Category_name_key";

-- AddForeignKey
ALTER TABLE "TransfersSubCategory" ADD CONSTRAINT "TransfersSubCategory_transfersId_fkey" FOREIGN KEY ("transfersId") REFERENCES "Transfers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransfersSubCategoryPaymentMethod" ADD CONSTRAINT "TransfersSubCategoryPaymentMethod_transfersSubCategoryId_fkey" FOREIGN KEY ("transfersSubCategoryId") REFERENCES "TransfersSubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
