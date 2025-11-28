const path = require('node:path');
const fs = require('node:fs/promises');

const connectDB = require('../config/db');

const User = require('../models/userModel');

const seedUsers = async () => {
  try {
    await connectDB();

    const userData = await fs.readFile(
      path.join(__dirname, 'users.json'),
      'utf-8'
    );
    const users = JSON.parse(userData);
    await User.deleteMany();
    for (const u of users) {
      await User.create(u);
    }

    console.log('User data seeded successfully');
    process.exit();
  } catch (err) {
    console.error('Error seeding user data:', err);
    process.exit(1);
  }
};

const deleteUsers = async () => {
  try {
    await connectDB();

    await User.deleteMany();

    console.log('User data deleted successfully');
    process.exit();
  } catch (err) {
    console.error('Error deleting user data:', err);
    process.exit(1);
  }
};

if (process.argv[2] === '--import') {
  seedUsers();
} else if (process.argv[2] === '--delete') {
  deleteUsers();
} else {
  console.log(
    'Please provide a valid argument: --import to seed data or --delete to remove data'
  );
  process.exit();
}
