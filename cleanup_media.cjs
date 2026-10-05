const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'riverbank';

async function main() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const media = await db.collection('media').find({}).toArray();
    
    const activeFiles = new Set();
    media.forEach(m => {
      if (m.filename) activeFiles.add(m.filename);
      if (m.sizes) {
        for (const size in m.sizes) {
          if (m.sizes[size].filename) activeFiles.add(m.sizes[size].filename);
        }
      }
    });

    const mediaDir = path.join(__dirname, 'public', 'media');
    if (!fs.existsSync(mediaDir)) {
      console.log('No public/media directory found.');
      return;
    }

    const filesOnDisk = fs.readdirSync(mediaDir);
    let deletedCount = 0;

    filesOnDisk.forEach(file => {
      // Ignore directories or hidden files
      if (file.startsWith('.')) return;
      if (fs.statSync(path.join(mediaDir, file)).isDirectory()) return;

      if (!activeFiles.has(file)) {
        fs.unlinkSync(path.join(mediaDir, file));
        deletedCount++;
      }
    });

    console.log(`Deleted ${deletedCount} unused images from public/media.`);
    console.log(`Kept ${activeFiles.size} active images.`);

  } finally {
    await client.close();
  }
}

main().catch(console.error);
