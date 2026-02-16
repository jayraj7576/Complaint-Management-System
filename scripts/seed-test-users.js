import dbConnect from '../lib/db.js';
import User from '../models/User.js';
import { hashPassword } from '../lib/auth.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seedTestUsers() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    // Test users to create
    const testUsers = [
      {
        name: 'Test User',
        email: 'user@test.com',
        password: 'user123',
        role: 'USER',
        phone: '1234567890',
        department: 'Computer Science',
      },
      {
        name: 'Admin User',
        email: 'admin@jspm.edu',
        password: 'admin123',
        role: 'ADMIN',
        phone: '9876543210',
        department: 'Administration',
      },
      {
        name: 'Department Head',
        email: 'dept@test.com',
        password: 'dept123',
        role: 'DEPARTMENT_HEAD',
        phone: '5555555555',
        department: 'Maintenance',
      },
    ];

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`User ${userData.email} already exists. Skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create user
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });

      console.log(`✓ Created ${userData.role}: ${userData.email}`);
    }

    console.log('\n=== Test Users Created Successfully ===');
    console.log('\nLogin Credentials:');
    console.log('1. Regular User:');
    console.log('   Email: user@test.com');
    console.log('   Password: user123');
    console.log('\n2. Admin:');
    console.log('   Email: admin@jspm.edu');
    console.log('   Password: admin123');
    console.log('\n3. Department Head:');
    console.log('   Email: dept@test.com');
    console.log('   Password: dept123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding test users:', error);
    process.exit(1);
  }
}

seedTestUsers();
