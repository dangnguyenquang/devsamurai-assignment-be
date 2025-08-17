import { PrismaClient, ContactType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const contactsData = [
  { name: 'Google', type: ContactType.COMPANY, avatarUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&h=400&fit=crop&crop=face' },
  { name: 'Microsoft', type: ContactType.COMPANY, avatarUrl: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400&h=400&fit=crop&crop=face' },
  { name: 'Airbnb', type: ContactType.COMPANY, avatarUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=face' },
  { name: 'Thomas Clark', type: ContactType.PERSON, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
  { name: 'Slack', type: ContactType.COMPANY, avatarUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop&crop=face' },
  { name: 'AMD', type: ContactType.COMPANY, avatarUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=face' },
  { name: 'Quang Dang', type: ContactType.PERSON, avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face' },
  { name: 'Uber', type: ContactType.COMPANY, avatarUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=400&h=400&fit=crop&crop=face' },
  { name: 'Disney', type: ContactType.COMPANY, avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face' },
  { name: 'Qualcomm', type: ContactType.COMPANY, avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face' },
  { name: 'DevSamurai', type: ContactType.COMPANY, avatarUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=400&fit=crop&crop=face' },
];

function getRandomDateInRange(startDate: Date, endDate: Date): Date {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return new Date(start + Math.random() * (end - start));
}

function generateVisitDates(contactCreatedAt: Date, visitCount: number): Date[] {
  const now = new Date();
  const dates: Date[] = [];
  
  for (let i = 0; i < visitCount; i++) {
    const randomDate = getRandomDateInRange(contactCreatedAt, now);
    dates.push(randomDate);
  }
  
  return dates.sort((a, b) => a.getTime() - b.getTime());
}

async function main() {
  console.log('Seeding database...');

  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' }
  });

  let adminUser;
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: hashedPassword,
      },
    });
    console.log('Admin user created:', adminUser.email);
  } else {
    adminUser = existingAdmin;
    console.log('Admin user already exists');
  }

  const sampleUsersData = [
    { name: 'John Doe', email: 'john@example.com', password: 'password123' },
    { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
  ];

  const users = [adminUser];

  for (const userData of sampleUsersData) {
    const existing = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    let user;
    if (!existing) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          passwordHash: hashedPassword,
        },
      });
      console.log(`Sample user created: ${userData.email}`);
    } else {
      user = existing;
    }
    users.push(user);
  }

  const now = new Date();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(now.getMonth() - 2);

  for (const user of users) {
    console.log(`Creating contacts for user: ${user.name}`);

    const existingContacts = await prisma.contact.count({
      where: { userId: user.id }
    });

    if (existingContacts > 0) {
      console.log(`User ${user.name} already has contacts, skipping...`);
      continue;
    }

    for (const contactData of contactsData) {
      const contactCreatedAt = getRandomDateInRange(twoMonthsAgo, now);
      
      const contact = await prisma.contact.create({
        data: {
          name: contactData.name,
          type: contactData.type,
          avatarUrl: contactData.avatarUrl,
          userId: user.id,
          createdAt: contactCreatedAt,
        },
      });

      const visitCount = Math.floor(Math.random() * 46) + 5;
      const visitDates = generateVisitDates(contactCreatedAt, visitCount);

      for (const visitDate of visitDates) {
        await prisma.contactVisit.create({
          data: {
            contactId: contact.id,
            userId: user.id,
            visitedAt: visitDate,
            createdAt: visitDate,
          },
        });
      }

      console.log(`Created contact: ${contact.name} with ${visitCount} visits`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });