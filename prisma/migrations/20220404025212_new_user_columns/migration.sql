/*
  Warnings:

  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apiKey` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "apiKey" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
