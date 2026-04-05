/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// .env ফাইলটি ম্যানুয়ালি লোড করা নিশ্চিত করছি
dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
  // Prisma 7-এর জেদি ভ্যালিডেশন এড়াতে (as any) ব্যবহার করে URL পাস করা
  const prisma = new (PrismaClient as any)({
    datasourceUrl: process.env.DATABASE_URL,
  });

  const saltRounds = 10;
  const hashedPassword = (await (bcrypt as any).hash(
    'password123',
    saltRounds,
  )) as string;

  console.log('🚀 Seeding process started with Direct URL Injection...');

  try {
    // ১. অ্যাডমিন ইউজার তৈরি
    await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    // ২. সাধারণ ইউজার তৈরি
    await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        password: hashedPassword,
        role: 'USER',
      },
    });

    console.log('✅ Success: Database Seeded in Supabase!');
  } catch (error) {
    console.error('❌ Error while seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
