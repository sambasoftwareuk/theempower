// Prisma client stub - prevents build errors
// This file exists to prevent module not found errors during build
// If you want to use Prisma, install it: npm install @prisma/client prisma

let prisma = null;

// Try to import Prisma if available, otherwise export null
try {
  const { PrismaClient } = require("@prisma/client");
  prisma = new PrismaClient();
} catch (error) {
  // Prisma not installed, will use file system instead
  console.warn("Prisma not available, using file system for media operations");
}

export default prisma;
