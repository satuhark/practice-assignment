const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')

const api = supertest(app)

test('tasks are returned as json', async () => {
  await api
    .get('/api/tasks')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .then(response => {
        console.log(response.body)
    })
})

test('there are two notes', async () => {
    const response = await api.get('/api/tasks')
  
    assert.strictEqual(response.body.length, 2)
  })
  
  test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/tasks')
  
    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
  })

after(async () => {
  await mongoose.connection.close()
})