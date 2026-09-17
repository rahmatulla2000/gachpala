const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...rest] = trimmed.split('=');
    const value = rest.join('=').replace(/^["']|["']$/g, '');
    process.env[key] = value;
  }
});

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const password = 'admin123';
  
  // Generate salt and hash step by step
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  
  console.log('Generated hash:', hash);
  console.log('Verify immediately:', bcrypt.compareSync(password, hash));

  // Delete existing and recreate
  await prisma.admin.deleteMany({ where: { email: 'admin@knowsabouttree.com' } });
  
  const admin = await prisma.admin.create({
    data: {
      name: 'Admin',
      email: 'admin@knowsabouttree.com',
      passwordHash: hash,
      role: 'admin',
    },
  });

  console.log('Admin created:', admin.email);

  // Verify from DB
  const dbAdmin = await prisma.admin.findUnique({ where: { email: 'admin@knowsabouttree.com' } });
  console.log('DB hash matches:', bcrypt.compareSync(password, dbAdmin.passwordHash));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
