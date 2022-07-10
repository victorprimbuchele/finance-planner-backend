-- AlterTable
ALTER TABLE "Transfers" ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TransfersSubCategoryPaymentMethod" (
    "id" SERIAL NOT NULL,
    "transfersSubCategoryId" INTEGER NOT NULL,
    "paymentMethodId" INTEGER NOT NULL,

    CONSTRAINT "TransfersSubCategoryPaymentMethod_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransfersSubCategoryPaymentMethod" ADD CONSTRAINT "TransfersSubCategoryPaymentMethod_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransfersSubCategoryPaymentMethod" ADD CONSTRAINT "TransfersSubCategoryPaymentMethod_transfersSubCategoryId_fkey" FOREIGN KEY ("transfersSubCategoryId") REFERENCES "TransfersSubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
