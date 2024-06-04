/*const mongoose = require('mongoose')
const config = require('./utils/config')

before(async () => {
  await mongoose.connect(config.TEST_MONGODB_URI)
})

beforeEach(async () => {
  await clearDatabase()
  await seedTestData()
})

after(async () => {
  await mongoose.connection.close()
})

async function clearDatabase() {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany()
  }
}

async function seedTestData() {
}
*/