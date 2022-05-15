-- AlterTable
ALTER TABLE "User" ALTER COLUMN "age" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "BlackList" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "BlackList_pkey" PRIMARY KEY ("id")
);
