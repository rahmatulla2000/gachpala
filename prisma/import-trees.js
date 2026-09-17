const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Load .env if present
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...rest] = trimmed.split('=');
      const value = rest.join('=').replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const prisma = new PrismaClient();

function slugToName(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

async function insertTrees(trees) {
  console.log(`🚀 Processing ${trees.length} trees...`);

  for (const treeData of trees) {
    const { categories: categorySlugs = [], ...fields } = treeData;

    // 1. Ensure all categories exist
    const categoryIds = [];
    for (const slug of categorySlugs) {
      const cat = await prisma.category.upsert({
        where: { slug },
        update: {},
        create: {
          slug,
          name: slugToName(slug),
          icon: '🌿',
          sortOrder: 10,
        },
      });
      categoryIds.push(cat.id);
    }

    // 2. Upsert Tree
    const tree = await prisma.tree.upsert({
      where: { slug: fields.slug },
      update: {
        ...fields,
      },
      create: {
        ...fields,
      },
    });

    // 3. Sync Categories
    // Remove existing connections for this tree to avoid duplicates
    await prisma.treeCategory.deleteMany({
      where: { treeId: tree.id },
    });

    if (categoryIds.length > 0) {
      await prisma.treeCategory.createMany({
        data: categoryIds.map(catId => ({
          treeId: tree.id,
          categoryId: catId,
        })),
        skipDuplicates: true,
      });
    }

    console.log(`✅ Tree saved: ${tree.englishName} (${tree.banglaName}) [slug: ${tree.slug}]`);
  }

  const count = await prisma.tree.count();
  console.log(`\n🎉 Total trees in database: ${count}`);
}

// Read input data
const dataPath = process.argv[2] || path.join(__dirname, 'data.json');
if (!fs.existsSync(dataPath)) {
  console.error(`File not found: ${dataPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(dataPath, 'utf8');
const trees = JSON.parse(raw);

insertTrees(trees)
  .catch(err => {
    console.error('❌ Error inserting trees:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
