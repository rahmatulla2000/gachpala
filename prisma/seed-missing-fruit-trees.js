const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const missingTrees = [
  {
    slug: "hog-plum-tree",
    banglaName: "আমড়া গাছ",
    englishName: "Hog Plum",
    commonName: "Amra",
    scientificName: "Spondias mombin",
    kingdom: "Plantae",
    family: "Anacardiaceae",
    genus: "Spondias",
    species: "S. mombin",
    height: "10-20 meters",
    lifespan: "50-80 years",
    description: "আমড়া বাংলাদেশের একটি অত্যন্ত পরিচিত ও জনপ্রিয় টক-মিষ্টি ফলদ বৃক্ষ। এর ফল কাঁচা বা পাকা খাওয়া হয় এবং চমৎকার চাটনি ও আচার তৈরি করা হয়।",
    characteristics: "মাঝারি আকারের পর্ণমোচী বৃক্ষ, যৌগিক পাতা এবং ছোট সাদা ফুলের মঞ্জরি বিশিষ্ট।",
    habitat: "উষ্ণ ও আর্দ্র ক্রান্তীয় আবহাওয়া, সুনিষ্কাশিত বেলে-দোআঁশ মাটিতে ভালো জন্মে।",
    distribution: "বাংলাদেশের প্রায় সব জেলাতেই চাষ হয়, বিশেষ করে দক্ষিণাঞ্চলের বরিশাল ও পিরোজপুরে প্রচুর জন্মে।",
    benefits: "প্রচুর ভিটামিন সি ও আয়রন সমৃদ্ধ, যা রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে এবং হজমে সহায়তা করে।",
    uses: "ফল কাঁচা লবণে মেখে বা রান্না করে টক ডাল ও চাটনি হিসেবে খাওয়া হয়। কাণ্ড নরম আসবাব তৈরিতে ব্যবহৃত হয়।",
    hasFruit: true,
    hasFlower: true,
    isNative: true,
    hasMedicinalUse: true,
    published: true,
    featured: false,
    fruitInfo: {
      name: "আমড়া (Hog Plum)",
      description: "সবুজ রঙের রসালো ডিম্বাকার ফল, ভেতরে একটি শক্ত আঁটি থাকে।",
      taste: "টক-মিষ্টি ও সুস্বাদু",
      season: "আগস্ট - নভেম্বর"
    }
  },
  {
    slug: "star-fruit-tree",
    banglaName: "কামরাঙ্গা গাছ",
    englishName: "Star Fruit",
    commonName: "Kamranga / Carambola",
    scientificName: "Averrhoa carambola",
    kingdom: "Plantae",
    family: "Oxalidaceae",
    genus: "Averrhoa",
    species: "A. carambola",
    height: "5-12 meters",
    lifespan: "40-60 years",
    description: "কামরাঙ্গা একটি চিরসবুজ ছোট থেকে মাঝারি আকৃতির গাছ। ফলটি আড়াআড়ি কাটলে তারার মতো দেখায় বলে একে ইংরেজিতে স্টার ফ্রুট বলা হয়।",
    characteristics: "গাছটি ঘন শাখাযুক্ত এবং হালকা সবুজ রঙের ছোট আকৃতির পাতা থাকে। ফুলগুলো ছোট ও বেগুনি-গোলাপি বর্ণের।",
    habitat: "উষ্ণ ও আর্দ্র আবহাওয়া পছন্দ করে এবং নিয়মিত সেচ প্রয়োজন হয়।",
    distribution: "সারা বাংলাদেশে বসতবাড়ির আঙিনায় ও ফলবাগানে দেখা যায়।",
    benefits: "অ্যান্টিঅক্সিডেন্ট, পটাশিয়াম এবং ভিটামিন সি সমৃদ্ধ। হজম শক্তি বাড়াতে দারুণ সহায়ক।",
    uses: "ফল তাজা খাওয়া হয়, সালাদ, জুস ও সুস্বাদু আচার তৈরিতে ব্যবহৃত হয়।",
    hasFruit: true,
    hasFlower: true,
    isNative: true,
    hasMedicinalUse: true,
    published: true,
    featured: false,
    fruitInfo: {
      name: "কামরাঙ্গা (Star Fruit)",
      description: "পাঁচটি খাঁজযুক্ত রসালো ফল, পাকা অবস্থায় হলুদ-কমলা রঙের হয়।",
      taste: "টক অথবা মিষ্টি-টক",
      season: "সেপ্টেম্বর - জানুয়ারি"
    }
  },
  {
    slug: "indian-jujube-tree",
    banglaName: "কুল গাছ",
    englishName: "Indian Jujube",
    commonName: "Boroi / Ber",
    scientificName: "Ziziphus mauritiana",
    kingdom: "Plantae",
    family: "Rhamnaceae",
    genus: "Ziziphus",
    species: "Z. mauritiana",
    height: "5-15 meters",
    lifespan: "30-50 years",
    description: "কুল বা বরই বাংলাদেশের অন্যতম জনপ্রিয় শীতকালীন ফল। বিভিন্ন উন্নত জাতের বাউকুল, আপেলকুল ও দেশি বরই বাংলাদেশে বাণিজ্যিকভাবে চাষ হয়।",
    characteristics: "ছোট বা মাঝারি কাঁটাযুক্ত গাছ, ছড়ানো ডালপালা এবং গোলগাল চকচকে সবুজ পাতা।",
    habitat: "শুষ্ক ও খরা সহনশীল, অনুর্বর মাটিতেও সহজে টিকে থাকে।",
    distribution: "সারা বাংলাদেশে, বিশেষ করে রাজশাহী, নাটোর, খুলনা ও কুমিল্লায় ব্যাপকভাবে চাষ হয়।",
    benefits: "ভিটামিন সি, ক্যালসিয়াম ও ফসফরাস সমৃদ্ধ যা সর্দি-কাশি প্রতিরোধে এবং হাড় গঠনে সাহায্য করে।",
    uses: "ফল তাজা খাওয়া হয়, শুকিয়ে সংরক্ষণ করা যায় এবং আচার তৈরি করা হয়। কাঠ দিয়ে কৃষি উপকরণ তৈরি হয়।",
    hasFruit: true,
    hasFlower: true,
    isNative: true,
    hasMedicinalUse: true,
    published: true,
    featured: false,
    fruitInfo: {
      name: "কুল / বরই (Jujube)",
      description: "গোলাকার বা ডিম্বাকার রসালো ফল, পাকা অবস্থায় লালচে বা হলুদাভ হয়।",
      taste: "মিষ্টি ও সামান্য টক",
      season: "ডিসেম্বর - মার্চ"
    }
  },
  {
    slug: "indian-olive-tree",
    banglaName: "জলপাই গাছ",
    englishName: "Indian Olive",
    commonName: "Jolpai",
    scientificName: "Elaeocarpus serratus",
    kingdom: "Plantae",
    family: "Elaeocarpaceae",
    genus: "Elaeocarpus",
    species: "E. serratus",
    height: "15-20 meters",
    lifespan: "60-100 years",
    description: "জলপাই বাংলাদেশের অত্যন্ত পরিচিত ও প্রিয় একটি টক ফলদ বৃক্ষ। ভেষজ গুণাবলীতে ভরপুর এই ফলটি প্রধানত আচার ও চাটনি তৈরিতে ব্যবহৃত হয়।",
    characteristics: "মাঝারি থেকে বৃহৎ চিরসবুজ গাছ, ঘন পাতা এবং সাদা রঙের সুগন্ধি ফুল ফোটে।",
    habitat: "ক্রান্তীয় বন ও আর্দ্র উপত্যকা, এঁটেল-দোআঁশ মাটিতে দ্রুত বৃদ্ধি পায়।",
    distribution: "সারা বাংলাদেশে বসতবাড়ি ও বাগানে লাগানো হয়।",
    benefits: "ভিটামিন সি ও অ্যান্টিঅক্সিডেন্টে ভরপুর। রক্তে শর্করা ও কোলেস্টেরল নিয়ন্ত্রণে ভূমিকা রাখে।",
    uses: "ফল দিয়ে মুখরোচক আচার ও চাটনি বানানো হয়। পাতা ও ছাল ঐতিহ্যবাহী ওষুধে ব্যবহৃত হয়।",
    hasFruit: true,
    hasFlower: true,
    isNative: true,
    hasMedicinalUse: true,
    published: true,
    featured: false,
    fruitInfo: {
      name: "জলপাই (Indian Olive)",
      description: "সবুজ রঙের মসৃণ ও মাংসল ফল, ভেতরে একটি শক্ত সূঁচালো আঁটি থাকে।",
      taste: "কষা ও টক",
      season: "সেপ্টেম্বর - ডিসেম্বর"
    }
  },
  {
    slug: "papaya-tree",
    banglaName: "পেঁপে গাছ",
    englishName: "Papaya",
    commonName: "Pepe",
    scientificName: "Carica papaya",
    kingdom: "Plantae",
    family: "Caricaceae",
    genus: "Carica",
    species: "C. papaya",
    height: "3-8 meters",
    lifespan: "3-5 years",
    description: "পেঁপে একটি দ্রুত বর্ধনশীল ফলদ উদ্ভিদ। কাঁচা অবস্থায় সবজি হিসেবে এবং পাকা অবস্থায় অত্যন্ত পুষ্টিকর ফল হিসেবে খাওয়া হয়।",
    characteristics: "নরম কাণ্ডের শাখাহীন গাছ, মাথায় বড় বড় খাঁজকাটা পাতার মুকুট থাকে।",
    habitat: "উষ্ণ রৌদ্রোজ্জ্বল পরিবেশ এবং জল জমে না এমন দোআঁশ মাটি উপযোগী।",
    distribution: "বাংলাদেশের প্রায় প্রতিটি বসতবাড়ি ও বাণিজ্যিক খামারে ব্যাপক চাষ হয়।",
    benefits: "প্যাপেইন এনজাইম থাকে যা হজমে খুব সাহায্য করে। প্রচুর ভিটামিন এ এবং সি সমৃদ্ধ।",
    uses: "কাঁচা পেঁপে রান্নায় এবং সালাদে, পাকা পেঁপে ফল বা জুস হিসেবে খাওয়া হয়।",
    hasFruit: true,
    hasFlower: true,
    isNative: false,
    hasMedicinalUse: true,
    published: true,
    featured: false,
    fruitInfo: {
      name: "পেঁপে (Papaya)",
      description: "লম্বাটে গোল ফল, কাঁচা অবস্থায় সবুজ এবং পাকা অবস্থায় চমৎকার কমলা বর্ণের হয়।",
      taste: "পাকা পেঁপে মিষ্টি ও কোমল",
      season: "সারা বছর"
    }
  },
  {
    slug: "lemon-tree",
    banglaName: "লেবু গাছ",
    englishName: "Lemon",
    commonName: "Lebu",
    scientificName: "Citrus limon",
    kingdom: "Plantae",
    family: "Rutaceae",
    genus: "Citrus",
    species: "C. limon",
    height: "3-6 meters",
    lifespan: "20-40 years",
    description: "লেবু একটি চিরসবুজ গুল্মজাতীয় ছোট বৃক্ষ। এর তীব্র সুগন্ধি ও টক রস খাদ্যতালিকায় রিফ্রেশিং স্বাদ যোগায়। বাংলাদেশে কাগজি লেবু, কলম্বো লেবু ইত্যাদি জনপ্রিয়।",
    characteristics: "কাঁটাযুক্ত শাখা-প্রশাখা, চকচকে গাঢ় সবুজ সুগন্ধযুক্ত পাতা এবং সুবাসিত সাদা ফুল।",
    habitat: "উষ্ণ রোদযুক্ত আবহাওয়া এবং সুনিষ্কাশিত দোআঁশ মাটিতে ভালো ফলন হয়।",
    distribution: "সারা বাংলাদেশে ব্যাপকভাবে চাষ হয়, বিশেষ করে সিলেট, শ্রীমঙ্গল ও নরসিংদীতে।",
    benefits: "প্রচুর সাইট্রিক অ্যাসিড ও ভিটামিন সি সমৃদ্ধ, যা রোগ প্রতিরোধ ক্ষমতা ও ত্বক সতেজ রাখতে সহায়তা করে।",
    uses: "শরবত তৈরিতে, খাবারে স্বাদ ও গন্ধ বাড়াতে এবং প্রসাধন শিল্পে ব্যবহৃত হয়।",
    hasFruit: true,
    hasFlower: true,
    isNative: true,
    hasMedicinalUse: true,
    published: true,
    featured: false,
    fruitInfo: {
      name: "লেবু (Lemon)",
      description: "ডিম্বাকার বা গোলাকার ফল, পাকা অবস্থায় হলুদ বা সবুজ রঙের হয়।",
      taste: "তীব্র টক ও সুগন্ধযুক্ত",
      season: "সারা বছর, বর্ষায় বেশি"
    }
  },
  {
    slug: "sapodilla-tree",
    banglaName: "সফেদা গাছ",
    englishName: "Sapodilla",
    commonName: "Sofeda / Chikoo",
    scientificName: "Manilkara zapota",
    kingdom: "Plantae",
    family: "Sapotaceae",
    genus: "Manilkara",
    species: "M. zapota",
    height: "10-25 meters",
    lifespan: "80-100 years",
    description: "সফেদা একটি দীর্ঘজীবী চিরসবুজ ফলদ বৃক্ষ। এর মিষ্টি, রসালো ও দানাদার ফল বাংলাদেশের একটি জনপ্রিয় ফল।",
    characteristics: "গাঢ় বাদামি বাকলযুক্ত মজবুত গুঁড়ি, চকচকে গাঢ় সবুজ পাতা এবং সাদাটে আঠালো কষ থাকে।",
    habitat: "উপকূলীয় আবহাওয়া ও লবণাক্ততা সহনশীল, উর্বর মাটিতে ভালো জন্মে।",
    distribution: "বাংলাদেশের দক্ষিণাঞ্চল ও বিভিন্ন ফলের বাগানে চাষ করা হয়।",
    benefits: "উচ্চমাত্রার শর্করা, ডায়েটরি ফাইবার এবং ভিটামিন এ ও সি থাকে যা তাৎক্ষণিক শক্তি জোগায়।",
    uses: "পাকা ফল মিষ্টি ফল হিসেবে সরাসরি খাওয়া হয়, মিল্কশেক ও মিষ্টি তৈরিতে ব্যবহৃত হয়।",
    hasFruit: true,
    hasFlower: true,
    isNative: false,
    hasMedicinalUse: true,
    published: true,
    featured: false,
    fruitInfo: {
      name: "সফেদা (Sapodilla)",
      description: "বাদামি খসখসে খোসাযুক্ত গোলাকার বা ডিম্বাকার ফল, ভেতরের অংশ মিষ্টি ও দানাদার।",
      taste: "অত্যন্ত মিষ্টি ও সুস্বাদু",
      season: "ফেব্রুয়ারি - জুন"
    }
  }
];

async function seed() {
  const fruitCategory = await prisma.category.findUnique({ where: { slug: 'fruit-trees' } });

  for (const treeData of missingTrees) {
    const existing = await prisma.tree.findFirst({
      where: {
        OR: [
          { scientificName: { equals: treeData.scientificName, mode: 'insensitive' } },
          { slug: treeData.slug }
        ]
      }
    });

    if (!existing) {
      console.log(`Inserting: ${treeData.banglaName} (${treeData.scientificName})...`);
      await prisma.tree.create({
        data: {
          ...treeData,
          createdByName: 'Admin',
          updatedByName: 'Admin',
          categories: fruitCategory ? { create: [{ categoryId: fruitCategory.id }] } : undefined
        }
      });
    } else {
      console.log(`Already exists: ${treeData.banglaName}`);
    }
  }

  console.log('All 15 fruit trees are now populated in the database!');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
