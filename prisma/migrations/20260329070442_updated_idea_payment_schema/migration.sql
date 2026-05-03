/*
  Warnings:

  - Made the column `price` on table `ideas` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "ideas" ALTER COLUMN "price" SET NOT NULL;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
