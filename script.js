import { prisma } from './lib/prisma.js';

async function main() {
  // 1. Create a new user
  console.log('Creating a new user...');
  const newUser = await prisma.user.create({
    data: {
      username: 'alice_smith',
      password: 'super-secure-password-123', // In a real app, hash this first!
    },
  });
  console.log('Created user:', newUser);

  // 2. Fetch all users
  console.log('Fetching all users...');
  const allUsers = await prisma.user.findMany();
  console.log('All users in DB:', allUsers);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });