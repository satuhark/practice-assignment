const config = require('../utils/config')
const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('tasks are returned as json', async () => {
  await api
    .get('/api/tasks')
    .expect(200)
})
test('number of tasks', async () => {
    const response = await api.get('/api/tasks')
  
    console.log('Number of tasks: ', response.body.length)
  })
  
  test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/tasks')
  
    const contents = response.body.map(e => e.content)
    assert.strictEqual(contents.includes('HTML is easy'), true)
  })

after(async () => {
  await mongoose.connection.close()
})