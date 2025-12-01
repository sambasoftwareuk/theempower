const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function addMissingMedia() {
  try {
    // public/uploads klasöründeki tüm dosyaları oku
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const files = fs.readdirSync(uploadsDir).filter(file => {
      const filePath = path.join(uploadsDir, file);
      return fs.statSync(filePath).isFile();
    });

    console.log(`Found ${files.length} files in uploads directory:`);
    files.forEach(file => console.log(`  - ${file}`));

    // Database'deki mevcut media kayıtlarını al
    const existingMedia = await prisma.media.findMany({
      select: { path: true, filename: true }
    });
    const existingPaths = new Set(existingMedia.map(m => m.path));
    console.log(`\nFound ${existingMedia.length} existing media records in database`);

    // Eksik olanları ekle
    let added = 0;
    for (const file of files) {
      const filePath = `/uploads/${file}`;
      
      if (existingPaths.has(filePath)) {
        console.log(`✓ ${file} already exists in database`);
        continue;
      }

      // Dosya uzantısından mime type belirle
      const ext = path.extname(file).toLowerCase();
      const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
      };
      const mimeType = mimeTypes[ext] || 'image/jpeg';

      // Alt text oluştur
      const altText = file.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

      try {
        const media = await prisma.media.create({
          data: {
            filename: file,
            originalFilename: file,
            mimeType: mimeType,
            size: 0,
            path: filePath,
            alt: altText,
          },
        });
        console.log(`✓ Added ${file} to database (ID: ${media.id})`);
        added++;
      } catch (error) {
        console.error(`✗ Failed to add ${file}:`, error.message);
      }
    }

    console.log(`\n✅ Added ${added} new media records to database`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMissingMedia();






