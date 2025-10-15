const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@prayinverses.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const passwordHash = await bcrypt.hash('Admin123!', 10);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: Role.SUPER_ADMIN,
        displayName: 'Super Admin',
      },
    });
    console.log('Seeded Super Admin →', email, ' / password: Admin123!');
  } else {
    console.log('Super Admin already exists:', email);
  }
}

async function seedCurated() {
  const count = await prisma.curatedPrayer.count();
  if (count > 0) {
    console.log('Curated prayers already exist:', count);
    return;
  }
  await prisma.curatedPrayer.createMany({
    data: [
      {
        book: 'Psalms',
        chapter: 23,
        verse: 1,
        theme: 'The Lord My Shepherd',
        scriptureText: 'The Lord is my shepherd; I shall not want.',
        insight: 'God’s guidance brings rest and provision.',
        prayerPoints: ['Thank God for His guidance', 'Ask for trust in seasons of lack'],
        closing: 'I confess the Lord leads me; I lack nothing.',
      },
      {
        book: 'Philippians',
        chapter: 4,
        verse: 6,
        theme: 'Peace Beyond Understanding',
        scriptureText: 'Do not be anxious about anything...',
        insight: 'Prayer replaces anxiety with God’s peace.',
        prayerPoints: ['Lay anxieties before God', 'Receive His peace today'],
        closing: 'I confess: God’s peace guards my heart and mind.',
      },
    ],
  });
  console.log('Seeded sample curated prayers.');
}

main()
  .then(seedCurated)
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });