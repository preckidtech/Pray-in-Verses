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

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
