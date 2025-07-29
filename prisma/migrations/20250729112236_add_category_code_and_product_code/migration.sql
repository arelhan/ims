/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productCode]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productCode` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add columns with default values first
ALTER TABLE "Category" ADD COLUMN "code" TEXT DEFAULT 'TMP';
ALTER TABLE "Inventory" ADD COLUMN "productCode" TEXT DEFAULT 'TMP-000000';

-- Step 2: Update existing records with proper values
UPDATE "Category" SET "code" = 'MWA' WHERE "name" = 'Laptop';
UPDATE "Category" SET "code" = 'OLD' WHERE "code" = 'TMP';

-- Step 3: Generate unique product codes for existing inventory (simple approach)
DO $$
DECLARE
    rec RECORD;
    counter INTEGER := 1;
BEGIN
    FOR rec IN SELECT "id" FROM "Inventory" WHERE "productCode" = 'TMP-000000' ORDER BY "createdAt"
    LOOP
        UPDATE "Inventory" SET "productCode" = 'OLD-' || LPAD(counter::TEXT, 6, '0') WHERE "id" = rec."id";
        counter := counter + 1;
    END LOOP;
END $$;

-- Step 4: Remove defaults and make required
ALTER TABLE "Category" ALTER COLUMN "code" DROP DEFAULT;
ALTER TABLE "Inventory" ALTER COLUMN "productCode" DROP DEFAULT;

-- Step 5: Create unique indexes
CREATE UNIQUE INDEX "Category_code_key" ON "Category"("code");
CREATE UNIQUE INDEX "Inventory_productCode_key" ON "Inventory"("productCode");
