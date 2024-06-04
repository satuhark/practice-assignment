const mongoose = require('mongoose')
const config = require('./utils/config')

before(async () => {
  await mongoose.connect(config.TEST_MONGODB_URI)
})

beforeEach(async () => {
  await clearDatabase()
  await seedTestData(); // Optional: Seed test data
});

// Disconnect from the test database after all tests are complete
after(async () => {
  await mongoose.connection.close();
});

// Helper function to clear the database
async function clearDatabase() {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}

// Helper function to seed test data (optional)
async function seedTestData() {
  // Insert test documents into collections
}
