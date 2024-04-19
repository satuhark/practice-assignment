const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Task = require('../models/task')

const app = require('../app')

const api = supertest(app)

const initialTasks = [
    {
        name: "HTML is easy",
        description: "",
        deadline: "",
        status: ""
    },
    {
        name: "Browser can execute only JavaScript",
        description: "",
        deadline: "",
        status: ""
    },
  ]

test('tasks are returned as json', async () => {
  await api
    .get('/api/tasks')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .then(response => {
        console.log(response.body)
    })
})

test('there are two tasks', async () => {
    const response = await api.get('/api/tasks')
  
    assert.strictEqual(response.body.length, initialTasks.length)
  })
  
  test('the first task is about HTTP methods', async () => {
    const response = await api.get('/api/tasks')
  
    const name = response.body.map(e => e.name)
    assert(name.includes('HTML is easy'))
  })

  beforeEach(async () => {
    await Task.deleteMany({})
    let taskObject = new Task(initialTasks[0])
    await taskObject.save()
    taskObject = new Task(initialTasks[1])
    await taskObject.save()
  })

after(async () => {
  await mongoose.connection.close()
})