/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;

  const hashedPassword = (await (bcrypt as any).hash(
    'password123',
    saltRounds,
  )) as string;

  console.log('🌱 Seeding started: Connecting to Supabase...');

  // ৩. অ্যাডমিন ইউজার তৈরি (যদি না থাকে)
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashedPassword,
      role: 'USER',
    },
  });

  console.log('✅ Success: admin@example.com & user@example.com are ready!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    // ৫. ডাটাবেজ কানেকশন বন্ধ করা
    await prisma.$disconnect();
  });
