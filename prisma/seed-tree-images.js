const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TREE_IMAGES = {
  'mango-tree': {
    url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1000',
    alt: 'আম গাছ এবং সুস্বাদু পাকা আম (Mango tree with ripe mangoes)',
    type: 'fruit',
  },
  'jackfruit-tree': {
    url: 'https://images.unsplash.com/photo-1629853472093-68d712128795?q=80&w=1000',
    alt: 'গাছে ধরা পাকা কাঁঠাল (Jackfruit on tree)',
    type: 'fruit',
  },
  'bamboo': {
    url: 'https://images.unsplash.com/photo-1509744645300-a2098b11871a?q=80&w=1000',
    alt: 'সবুজ বাঁশ ঝাড় (Green bamboo grove)',
    type: 'full_tree',
  },
  'krishnachura': {
    url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1000',
    alt: 'রক্তিম কৃষ্ণচূড়া ফুলসহ গাছ (Blooming red Krishnachura tree)',
    type: 'flower',
  },
  'neem-tree': {
    url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1000',
    alt: 'ঔষধি নিম গাছের সবুজ পাতা (Medicinal neem tree leaves)',
    type: 'leaf',
  },
  'shimul-tree': {
    url: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=1000',
    alt: 'লাল শিমুল ফুল ও গাছ (Red Shimul silk cotton tree)',
    type: 'flower',
  },
  'banyan-tree': {
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1000',
    alt: 'বিশাল ছায়াঘেরা প্রাচীন বট গাছ (Ancient Banyan tree)',
    type: 'full_tree',
  },
  'haritaki': {
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000',
    alt: 'ঔষধি হরিতকী ফল ও গাছ (Medicinal Haritaki tree)',
    type: 'fruit',
  },
  'haritaki-tree': {
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000',
    alt: 'হরিতকি গাছ ও ঔষধি ফল (Haritaki tree)',
    type: 'fruit',
  },
  'arjun-tree': {
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000',
    alt: 'ঔষধি অর্জুন গাছ (Medicinal Arjun tree)',
    type: 'bark',
  },
  'bahera-tree': {
    url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1000',
    alt: 'বহেরা গাছ ও ফল (Beleric tree and fruits)',
    type: 'fruit',
  },
  'amloki-tree': {
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000',
    alt: 'ভিটামিন সি সমৃদ্ধ আমলকি গাছ (Indian Gooseberry tree)',
    type: 'fruit',
  },
  'tamarind-tree': {
    url: 'https://images.unsplash.com/photo-1615485290464-a698a9645f78?q=80&w=1000',
    alt: 'তেঁতুল গাছ ও ঝুলন্ত পাকা তেঁতুল (Tamarind pods on tree)',
    type: 'fruit',
  },
  'hog-plum-tree': {
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1000',
    alt: 'আমড়া গাছ ও সবুজ ফল (Hog plum tree with fruits)',
    type: 'fruit',
  },
  'star-fruit-tree': {
    url: 'https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=1000',
    alt: 'কামরাঙ্গা গাছ ও পাকা কামরাঙ্গা (Star fruit tree)',
    type: 'fruit',
  },
  'indian-jujube-tree': {
    url: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=1000',
    alt: 'কুল বা বরই গাছ ও ফল (Indian Jujube tree)',
    type: 'fruit',
  },
  'indian-olive-tree': {
    url: 'https://images.unsplash.com/photo-1541256942802-7b2996802bf1?q=80&w=1000',
    alt: 'জলপাই গাছ ও সবুজ জলপাই (Indian olive tree)',
    type: 'fruit',
  },
  'papaya-tree': {
    url: 'https://images.unsplash.com/photo-1517282009859-f009c37129b9?q=80&w=1000',
    alt: 'পেঁপে গাছ ও পেঁপে ফল (Papaya tree with fruits)',
    type: 'fruit',
  },
  'lemon-tree': {
    url: 'https://images.unsplash.com/photo-1533082603883-3be80a3a456c?q=80&w=1000',
    alt: 'লেবু গাছ ও তাজা লেবু (Lemon tree with fresh lemons)',
    type: 'fruit',
  },
  'sapodilla-tree': {
    url: 'https://res.cloudinary.com/hprovw7y/image/upload/v1789652164/knows-about-tree/trees/fkbfohvfs829zqqmdky0.jpg',
    alt: 'মিষ্টি সফেদা ফল ও গাছ (Sapodilla tree)',
    type: 'fruit',
  },
  'java-plum-tree': {
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1000',
    alt: 'কালো জাম গাছ ও জাম ফল (Java plum tree)',
    type: 'fruit',
  },
  'coconut-tree': {
    url: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=1000',
    alt: 'উঁচু নারিকেল গাছ ও ডাব (Tall coconut tree)',
    type: 'fruit',
  },
  'bael-tree': {
    url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=1000',
    alt: 'ঔষধি বেল গাছ ও ফল (Bael tree and fruit)',
    type: 'fruit',
  },
  'lychee-tree': {
    url: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?q=80&w=1000',
    alt: 'রসালো লাল লিচুসহ গাছ (Lychee tree with red ripe fruits)',
    type: 'fruit',
  }
};

async function seedImages() {
  console.log('🌿 Starting to seed tree images in database...');

  const trees = await prisma.tree.findMany({
    include: { images: true }
  });

  console.log(`Found ${trees.length} trees in database.`);
  let addedCount = 0;

  for (const tree of trees) {
    if (tree.images && tree.images.length > 0) {
      console.log(`⏩ [SKIP] ${tree.banglaName} already has ${tree.images.length} image(s).`);
      continue;
    }

    const imgData = TREE_IMAGES[tree.slug];
    if (imgData) {
      await prisma.treeImage.create({
        data: {
          treeId: tree.id,
          url: imgData.url,
          altText: imgData.alt,
          type: imgData.type,
          isPrimary: true,
          sortOrder: 0,
          uploadedByName: 'System Seed'
        }
      });
      console.log(`✅ [ADDED] Image added for ${tree.banglaName} (${tree.englishName})`);
      addedCount++;
    } else {
      // Fallback
      const fallbackUrl = 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1000';
      await prisma.treeImage.create({
        data: {
          treeId: tree.id,
          url: fallbackUrl,
          altText: `${tree.banglaName} (${tree.englishName})`,
          type: 'full_tree',
          isPrimary: true,
          sortOrder: 0,
          uploadedByName: 'System Seed'
        }
      });
      console.log(`⚠️ [FALLBACK] Default image added for ${tree.banglaName} (${tree.englishName})`);
      addedCount++;
    }
  }

  console.log(`\n🎉 Done! Added images for ${addedCount} trees.`);
}

seedImages()
  .catch((err) => {
    console.error('Error seeding images:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
