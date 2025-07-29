/*
  Warnings:

  - Made the column `code` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productCode` on table `Inventory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "productCode" SET NOT NULL;
