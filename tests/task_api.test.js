const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Task = require('../models/task')

beforeEach(async () => {
    await Task.deleteMany({})
    let taskObject = new Task(helper.initialTasks[0])
    await taskObject.save()
    taskObject = new Task(helper.initialTasks[1])
    await taskObject.save()
  })

test('tasks are returned as json', async () => {
  await api
    .get('/api/tasks')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .then(response => {
        console.log(response.body)
    })
})

test('all tasks are returned', async () => {
    const response = await api.get('/api/tasks')
     assert.strictEqual(response.body.length, helper.initialTasks.length)
  })

  test('a specific task is within the returned tasks', async () => {
    const response = await api.get('/api/tasks')
    const names = response.body.map(r => r.name)
    assert(names.includes('Browser can execute only JavaScript'))
  })
  
  test('a valid task can be added ', async () => {
    const newTask = {
      name: 'async/await simplifies making async calls',
      description: "jdsks",
      deadline: "22.04.2024",
      status: "To Do"
    }
  
    await api
      .post('/api/tasks')
      .send(newTask)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      
      const tasksAtEnd = await helper.tasksInDb()
      assert.strictEqual(tasksAtEnd.length, helper.initialTasks.length + 1)
      
      const names = tasksAtEnd.map(n => n.name)
      assert(names.includes('async/await simplifies making async calls'))
    })
    
    test('task without name is not added', async () => {
        const newTask = {
            description: "jdsks",
        }
        await api
        .post('/api/tasks')
        .send(newTask)
        .expect(400)
        
        const tasksAtEnd = await helper.tasksInDb()
        assert.strictEqual(tasksAtEnd.length, helper.initialTasks.length + 1)
})

after(async () => {
  await mongoose.connection.close()
})