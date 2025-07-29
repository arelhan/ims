/*
  Warnings:

  - A unique constraint covering the columns `[barcode]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "condition" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "purchaseDate" TIMESTAMP(3),
ADD COLUMN     "purchasePrice" DOUBLE PRECISION,
ADD COLUMN     "specifications" JSONB,
ADD COLUMN     "supplier" TEXT,
ADD COLUMN     "warrantyDate" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_barcode_key" ON "Inventory"("barcode");
