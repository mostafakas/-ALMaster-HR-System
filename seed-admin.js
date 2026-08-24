const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Kastello@99', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'mostafa@almaster.com' },
    update: {
      password: hashedPassword,
      fullName: 'Mustafa Mahmoud',
      role: 'Super Admin'
    },
    create: {
      email: 'mostafa@almaster.com',
      password: hashedPassword,
      fullName: 'Mustafa Mahmoud',
      role: 'Super Admin'
    }
  });
  console.log('User created:', user.email);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
