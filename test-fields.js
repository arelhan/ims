import { prisma } from "./src/lib/prisma.ts";

async function testFields() {
  try {
    // Test Category fields
    const category = await prisma.category.findFirst({
      select: {
        id: true,
        name: true,
        code: true,
        fieldTemplate: true
      }
    });
    console.log("Category fields:", category);

    // Test Inventory fields  
    const inventory = await prisma.inventory.findFirst({
      select: {
        id: true,
        name: true,
        productCode: true,
        specifications: true
      }
    });
    console.log("Inventory fields:", inventory);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testFields();
