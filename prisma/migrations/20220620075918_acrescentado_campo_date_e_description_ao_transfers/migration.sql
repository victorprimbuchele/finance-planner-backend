/*
  Warnings:

  - Added the required column `date` to the `Transfers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Transfers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Transfers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transfers" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transfers" ADD CONSTRAINT "Transfers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
