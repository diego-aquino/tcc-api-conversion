-- CreateEnum
CREATE TYPE "ConversionState" AS ENUM('PENDING', 'COMPLETED', 'ERROR');

-- CreateTable
CREATE TABLE "Conversion" (
  "id" TEXT NOT NULL,
  "state" "ConversionState" NOT NULL,
  "toBeCompletedAt" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "inputFileId" TEXT NOT NULL,
  "outputFileId" TEXT NOT NULL,
  CONSTRAINT "Conversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Conversion"
ADD CONSTRAINT "Conversion_inputFileId_fkey" FOREIGN KEY ("inputFileId") REFERENCES "File" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversion"
ADD CONSTRAINT "Conversion_outputFileId_fkey" FOREIGN KEY ("outputFileId") REFERENCES "File" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
