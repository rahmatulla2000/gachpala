/**
 * Database Seed Script
 * Run: npm run db:seed
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Admin
  const passwordHash = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@knowsabouttree.com' },
    update: {},
    create: {
      email: 'admin@knowsabouttree.com',
      name: 'Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // 2. Create Categories
  const categoriesData = [
    { name: 'Fruit Trees', slug: 'fruit-trees', icon: '🍎', sortOrder: 1, description: 'Trees that bear edible fruits' },
    { name: 'Flowering Trees', slug: 'flowering-trees', icon: '🌸', sortOrder: 2, description: 'Trees known for their beautiful flowers' },
    { name: 'Medicinal Trees', slug: 'medicinal-trees', icon: '💊', sortOrder: 3, description: 'Trees with medicinal properties' },
    { name: 'Timber Trees', slug: 'timber-trees', icon: '🪵', sortOrder: 4, description: 'Trees valuable for their wood' },
    { name: 'Forest Trees', slug: 'forest-trees', icon: '🌲', sortOrder: 5, description: 'Native forest trees' },
    { name: 'Ornamental Trees', slug: 'ornamental-trees', icon: '🎋', sortOrder: 6, description: 'Trees grown for decorative purposes' },
    { name: 'Evergreen Trees', slug: 'evergreen-trees', icon: '🌿', sortOrder: 7, description: 'Trees that keep their leaves year-round' },
    { name: 'Native Trees', slug: 'native-trees', icon: '🌏', sortOrder: 8, description: 'Trees native to Bangladesh and South Asia' },
  ];

  const categories: Record<string, { id: string }> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = { id: created.id };
  }
  console.log(`✅ ${categoriesData.length} categories created`);

  // 3. Create Trees
  const treesData = [
    {
      slug: 'mango-tree',
      banglaName: 'আম গাছ',
      englishName: 'Mango Tree',
      commonName: 'Mango',
      scientificName: 'Mangifera indica',
      kingdom: 'Plantae',
      phylum: 'Tracheophyta',
      taxClass: 'Magnoliopsida',
      order: 'Sapindales',
      family: 'Anacardiaceae',
      genus: 'Mangifera',
      species: 'M. indica',
      description: 'The mango tree is the national tree of Bangladesh and one of the most important fruit trees in South Asia. It is a large, evergreen tropical tree known for its delicious fruit. Mango trees can live for hundreds of years and continue bearing fruit throughout their lifespan.',
      characteristics: 'Large evergreen tree reaching 10-40 meters in height. Has a dense canopy with long lance-shaped dark green leaves. Young leaves are copper-red in color. The bark is dark brown and rough. Trees may live for several hundred years.',
      habitat: 'Tropical and subtropical regions. Prefers deep, well-drained soil and a frost-free environment. Grows best in areas with a pronounced dry season.',
      distribution: 'Native to South Asia (India, Bangladesh, Myanmar). Now cultivated throughout the tropical world including Southeast Asia, Africa, and the Americas.',
      height: '10-40 meters',
      lifespan: '100-300+ years',
      benefits: 'The fruit is an excellent source of vitamins A, C, and B6. Leaves have medicinal uses. The wood is used for furniture making. Provides habitat for various birds and insects.',
      uses: 'Fruit is eaten fresh, dried, or used in cooking. Leaves used in religious ceremonies. Wood used for furniture, flooring, and boats. Used in traditional medicine for digestive issues.',
      hasFruit: true,
      hasFlower: true,
      isNative: true,
      hasMedicinalUse: true,
      published: true,
      featured: true,
      fruitInfo: {
        name: 'Mango (আম)',
        description: 'Sweet, juicy drupe with a large seed. The flesh is fibrous and ranges from pale yellow to deep orange.',
        taste: 'Sweet with a slight tangy flavor, highly aromatic',
        season: 'May - August',
        uses: 'Eaten fresh, used in juices, smoothies, pickles, dried fruit, and desserts.',
        nutrition: 'Rich in Vitamin C, Vitamin A, folate, potassium',
      },
      flowerInfo: {
        name: 'Mango Blossom (মুকুল)',
        color: 'Yellowish-white to cream',
        season: 'February - March',
        description: 'Small, fragrant flowers growing in large clusters (panicles) at branch tips. Flowers are pollinated by bees, wasps, and flies.',
      },
      categories: ['fruit-trees', 'native-trees'],
    },
    {
      slug: 'jackfruit-tree',
      banglaName: 'কাঁঠাল গাছ',
      englishName: 'Jackfruit Tree',
      commonName: 'Jackfruit, Jack',
      scientificName: 'Artocarpus heterophyllus',
      kingdom: 'Plantae',
      phylum: 'Tracheophyta',
      taxClass: 'Magnoliopsida',
      order: 'Rosales',
      family: 'Moraceae',
      genus: 'Artocarpus',
      species: 'A. heterophyllus',
      description: 'The jackfruit is the national fruit of Bangladesh. The jackfruit tree is a large tropical tree that produces the largest fruit of any tree in the world. It is an important food source in tropical regions.',
      characteristics: 'Medium to large evergreen tree, typically 8-25 meters tall. Has large, oval, dark green leaves. Bark is dark green when young, becoming greyish-brown and rough with age.',
      habitat: 'Tropical lowland rainforest. Thrives in humid tropics with well-distributed rainfall. Grows in both humid and subhumid tropical climates.',
      distribution: 'Native to South Asia and Southeast Asia. Widely cultivated throughout the tropics worldwide.',
      height: '8-25 meters',
      lifespan: '60-100 years',
      benefits: 'Produces the largest tree fruit in the world. Rich in nutrients. The wood is excellent for furniture, musical instruments, and construction.',
      uses: 'Ripe fruit is eaten fresh. Unripe fruit is used as a vegetable (popular meat substitute). Seeds are boiled or roasted. Wood is highly valued for furniture and construction.',
      hasFruit: true,
      hasFlower: true,
      isNative: true,
      hasMedicinalUse: false,
      published: true,
      featured: true,
      fruitInfo: {
        name: 'Jackfruit (কাঁঠাল)',
        description: 'The largest fruit produced by any tree. Can weigh up to 35 kg. Has a spiky green exterior and sweet yellow flesh inside.',
        taste: 'Sweet and aromatic when ripe; mild, starchy when unripe',
        season: 'May - August',
        uses: 'Ripe fruit: eaten fresh or in desserts. Unripe: used as a vegetable. Seeds: boiled or roasted as a snack.',
      },
      categories: ['fruit-trees', 'native-trees'],
    },
    {
      slug: 'bamboo',
      banglaName: 'বাঁশ',
      englishName: 'Bamboo',
      commonName: 'Bamboo, Giant Bamboo',
      scientificName: 'Bambusa bambos',
      kingdom: 'Plantae',
      phylum: 'Tracheophyta',
      taxClass: 'Liliopsida',
      order: 'Poales',
      family: 'Poaceae',
      genus: 'Bambusa',
      species: 'B. bambos',
      description: 'Bamboo is one of the fastest-growing plants in the world and plays a crucial role in the daily lives of people in Bangladesh. Though technically a grass, it grows to tree-like heights and is used extensively in construction, crafts, and as food.',
      characteristics: 'Giant grass that grows in dense clumps. Hollow, woody culms can reach heights of 20-30 meters. Has lance-shaped leaves. Grows very rapidly — up to 91 cm per day in ideal conditions.',
      habitat: 'Tropical and subtropical climates. Found in diverse habitats from sea level to high altitude. Often grows along riverbanks and in forest margins.',
      distribution: 'Native to tropical and subtropical Asia. Widely cultivated throughout tropical regions worldwide.',
      height: '15-30 meters',
      lifespan: 'Individual culms live 5-7 years; the root system can live for decades',
      benefits: 'Excellent carbon sequestration. Prevents soil erosion. Provides habitat for wildlife. The shoots are edible and nutritious.',
      uses: 'Construction (houses, bridges, scaffolding). Furniture and handicrafts. Paper production. Young shoots eaten as vegetables. Musical instruments.',
      hasFruit: false,
      hasFlower: false,
      isNative: true,
      hasMedicinalUse: true,
      published: true,
      featured: false,
      categories: ['native-trees', 'timber-trees'],
    },
    {
      slug: 'krishnachura',
      banglaName: 'কৃষ্ণচূড়া',
      englishName: 'Flamboyant Tree',
      commonName: 'Royal Poinciana, Peacock Flower',
      scientificName: 'Delonix regia',
      kingdom: 'Plantae',
      phylum: 'Tracheophyta',
      taxClass: 'Magnoliopsida',
      order: 'Fabales',
      family: 'Fabaceae',
      genus: 'Delonix',
      species: 'D. regia',
      description: 'The Krishnachura or Flamboyant tree is one of the most spectacular flowering trees in Bangladesh. It explodes with brilliant red-orange flowers during summer. The tree is often planted as an ornamental street tree throughout Bangladesh.',
      characteristics: 'Wide, spreading deciduous or semi-evergreen tree reaching 5-12 meters. Has a distinctive flat, umbrella-like crown. Produces bright red-orange flowers in large clusters.',
      habitat: 'Thrives in tropical and subtropical regions. Prefers full sun and well-drained soil. Drought-tolerant once established.',
      distribution: 'Native to Madagascar. Now widely naturalized and cultivated throughout the tropics including South Asia, Southeast Asia, the Caribbean, and Africa.',
      height: '5-12 meters',
      lifespan: '40-50 years',
      benefits: 'Provides shade with its wide canopy. Nitrogen-fixing tree that improves soil fertility. An important source of nectar for bees and butterflies.',
      uses: 'Ornamental tree for streets, parks, and gardens. Seed pods used as percussion instruments. Has some traditional medicinal uses.',
      hasFruit: false,
      hasFlower: true,
      isNative: false,
      hasMedicinalUse: false,
      published: true,
      featured: true,
      flowerInfo: {
        name: 'Krishnachura Flower',
        color: 'Bright red-orange with yellow markings',
        season: 'April - June (summer)',
        description: 'Large, showy flowers with five petals. Four petals are red-orange and one petal has yellow and white markings. Flowers appear in dense clusters.',
      },
      categories: ['flowering-trees', 'ornamental-trees'],
    },
    {
      slug: 'neem-tree',
      banglaName: 'নিম গাছ',
      englishName: 'Neem Tree',
      commonName: 'Neem, Indian Lilac, Nim',
      scientificName: 'Azadirachta indica',
      kingdom: 'Plantae',
      phylum: 'Tracheophyta',
      taxClass: 'Magnoliopsida',
      order: 'Sapindales',
      family: 'Meliaceae',
      genus: 'Azadirachta',
      species: 'A. indica',
      description: 'The neem tree is one of the most important medicinal trees in Bangladesh and throughout South Asia. Known as the "village pharmacy," virtually every part of the tree has medicinal value. It has been used in traditional medicine for thousands of years.',
      characteristics: 'Medium-sized, fast-growing evergreen tree reaching 15-20 meters. Has small, fragrant white flowers. Dark green, pinnate leaves with serrated edges.',
      habitat: 'Tropical and semi-arid regions. Very drought-tolerant. Can grow in poor soils and tolerates high temperatures.',
      distribution: 'Native to the Indian subcontinent. Widely cultivated throughout tropical and subtropical regions worldwide.',
      height: '15-20 meters',
      lifespan: '150-200 years',
      benefits: 'Powerful natural insecticide and pesticide. Air purifying qualities. Anti-bacterial, anti-fungal, and anti-viral properties. Provides shade and is fast-growing.',
      uses: 'Traditional medicine (skin diseases, dental care, malaria, diabetes). Neem oil used in cosmetics and pesticides. Leaves used as natural insect repellent. Twigs used as toothbrushes.',
      hasFruit: true,
      hasFlower: true,
      isNative: true,
      hasMedicinalUse: true,
      published: true,
      featured: false,
      flowerInfo: {
        name: 'Neem Flower',
        color: 'White to cream',
        season: 'February - April',
        description: 'Small, fragrant, five-petaled white flowers in clusters. Very attractive to bees.',
      },
      categories: ['medicinal-trees', 'native-trees'],
    },
    {
      slug: 'shimul-tree',
      banglaName: 'শিমুল গাছ',
      englishName: 'Silk Cotton Tree',
      commonName: 'Red Silk-Cotton, Shimul',
      scientificName: 'Bombax ceiba',
      kingdom: 'Plantae',
      phylum: 'Tracheophyta',
      taxClass: 'Magnoliopsida',
      order: 'Malvales',
      family: 'Malvaceae',
      genus: 'Bombax',
      species: 'B. ceiba',
      description: 'The Shimul tree is one of the most dramatic flowering trees of Bangladesh. It produces brilliant red flowers on bare, leafless branches in late winter to early spring. It is one of the tallest trees in Bangladesh.',
      characteristics: 'Large, tall deciduous tree reaching 30-40 meters. Trunk is covered with conical spines when young. Leaves are palmately compound. Branches are horizontal.',
      habitat: 'Tropical and subtropical regions. Found in forests, along rivers, and in open areas. Grows in a variety of soils.',
      distribution: 'Native to tropical Asia, from India and Bangladesh eastward to China and Australia.',
      height: '30-40 meters',
      lifespan: '100-200 years',
      benefits: 'Cotton-like fiber from seed pods used for stuffing. Wood used for making matches and paper pulp. Important ecological role in tropical forests.',
      uses: 'The cotton-like fiber from the seed capsules (kapok) is used for stuffing pillows and mattresses. Young flowers and leaves are edible.',
      hasFruit: false,
      hasFlower: true,
      isNative: true,
      hasMedicinalUse: false,
      published: true,
      featured: false,
      flowerInfo: {
        name: 'Shimul Flower',
        color: 'Bright red',
        season: 'February - March (before leaves appear)',
        description: 'Large, cup-shaped red flowers with five fleshy petals. Very attractive to birds, especially sunbirds, which feed on the nectar.',
      },
      categories: ['flowering-trees', 'native-trees', 'timber-trees'],
    },
    {
      slug: 'banyan-tree',
      banglaName: 'বট গাছ',
      englishName: 'Banyan Tree',
      commonName: 'Banyan, Indian Banyan',
      scientificName: 'Ficus benghalensis',
      kingdom: 'Plantae',
      phylum: 'Tracheophyta',
      taxClass: 'Magnoliopsida',
      order: 'Rosales',
      family: 'Moraceae',
      genus: 'Ficus',
      species: 'F. benghalensis',
      description: 'The banyan tree, named after the Bengal region, is one of the most culturally significant trees in South Asia. It is the national tree of India. Individual trees can spread over vast areas and live for hundreds of years.',
      characteristics: 'Large, evergreen tree that sends aerial prop roots from branches to the ground. Can spread over hectares of land. The largest known banyan tree covers an area of about 1.5 hectares.',
      habitat: 'Tropical and subtropical lowlands. Often grows near water sources. Can grow on rocks, buildings, and other trees.',
      distribution: 'Native to the Indian subcontinent. Widely planted throughout tropical regions of the world.',
      height: '20-30 meters (spread can be much larger)',
      lifespan: 'Several hundred to over 1000 years',
      benefits: 'Important shade tree. Provides habitat for numerous wildlife species. Sacred in Hindu and Buddhist traditions. Roots prevent soil erosion.',
      uses: 'Sacred tree in Hinduism and Buddhism. Bark, leaves, and latex used in traditional medicine. Fruit eaten by birds and animals. Shade tree for villages.',
      hasFruit: true,
      hasFlower: false,
      isNative: true,
      hasMedicinalUse: true,
      published: true,
      featured: false,
      categories: ['native-trees', 'medicinal-trees', 'forest-trees'],
    },
    {
      slug: 'horitoki',
      banglaName: 'হরিতকী',
      englishName: 'Chebulic Myrobalan',
      commonName: 'Haritaki, Black Myrobalan',
      scientificName: 'Terminalia chebula',
      kingdom: 'Plantae',
      phylum: 'Tracheophyta',
      taxClass: 'Magnoliopsida',
      order: 'Myrtales',
      family: 'Combretaceae',
      genus: 'Terminalia',
      species: 'T. chebula',
      description: 'Haritaki is one of the most important medicinal trees in Ayurvedic and traditional Bangladeshi medicine. The fruit is used in numerous traditional remedies and is part of the famous "Triphala" formulation. It has been used medicinally for thousands of years.',
      characteristics: 'Medium-sized deciduous tree reaching 15-25 meters. Has oval to elliptical leaves. Small, yellowish-white flowers in terminal spikes.',
      habitat: 'Tropical and subtropical dry deciduous forests. Found in hilly and mountainous areas. Grows in a variety of soils.',
      distribution: 'Native to South Asia and Southeast Asia. Found from Nepal, Bangladesh, and India through Myanmar and Thailand.',
      height: '15-25 meters',
      lifespan: '100-150 years',
      benefits: 'One of the most valued medicinal plants in traditional medicine. The fruit has antioxidant, anti-inflammatory, and anti-bacterial properties.',
      uses: 'Traditional medicine: digestive disorders, skin diseases, eye problems, dental care. Part of Triphala (three-fruit) Ayurvedic formula. Fruit used in dyeing and tanning.',
      hasFruit: true,
      hasFlower: true,
      isNative: true,
      hasMedicinalUse: true,
      published: true,
      featured: false,
      fruitInfo: {
        name: 'Haritaki Fruit',
        description: 'Small, oval drupe, 2-4 cm long. Green when young, turning yellow to brown when ripe. Has a single hard seed inside.',
        taste: 'Complex — simultaneously sweet, sour, bitter, pungent, and astringent',
        season: 'October - December',
        uses: 'Used dried in traditional medicine. Also used in hair care products.',
      },
      categories: ['medicinal-trees', 'native-trees'],
    },
  ];

  for (const treeData of treesData) {
    const { categories: categorySlugList, ...treeFields } = treeData;

    const tree = await prisma.tree.upsert({
      where: { slug: treeData.slug },
      update: {},
      create: {
        ...treeFields,
        fruitInfo: treeFields.fruitInfo ? treeFields.fruitInfo : undefined,
        flowerInfo: treeFields.flowerInfo ? treeFields.flowerInfo : undefined,
        categories: {
          create: categorySlugList.map((slug) => ({
            category: { connect: { slug } },
          })),
        },
      },
    });

    console.log(`✅ Tree: ${tree.englishName} (${tree.banglaName})`);
  }

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Admin credentials:');
  console.log('   Email: admin@knowsabouttree.com');
  console.log('   Password: Admin@123');
  console.log('\n⚠️  Change the admin password after first login!');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
