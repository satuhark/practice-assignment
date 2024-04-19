const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Task = require('../models/task')

beforeEach(async () => {
    await Task.deleteMany({})
    for (let task of helper.initialTasks) {
        let taskObject = new Task(task)
        await taskObject.save()
      }
    })

describe('Returning tasks', () => {
    test('tasks are returned as json', async () => {
        const response = await api.get('/api/tasks')
        assert.strictEqual(response.status, 200)
        assert(response.headers['content-type'].includes('application/json'))
    })

    test('a specific task is within the returned tasks', async () => {
        const response = await api.get('/api/tasks')
        const names = response.body.map(r => r.name)
        assert(names.includes('Browser can execute only JavaScript'))
    })
})

describe('Adding tasks', () => {
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
})

describe('Viewing and deleting', () => {
    test('a specific task can be viewed', async () => {
        const tasksAtStart = await helper.tasksInDb()
        const taskToView = tasksAtStart[0]
        const resultTask = await api
            .get(`/api/tasks/${taskToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
            assert.deepStrictEqual(resultTask.body, taskToView)
    })

    test('a task can be deleted', async () => {
        const tasksAtStart = await helper.tasksInDb()
        const taskToDelete = tasksAtStart[0]
        await api
        .delete(`/api/tasks/${taskToDelete.id}`)
        .expect(200)
        const tasksAtEnd = await helper.tasksInDb()
        const names = tasksAtEnd.map(r => r.name)
        assert(!names.includes(taskToDelete.name))
        assert.strictEqual(tasksAtEnd.length, helper.initialTasks.length - 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})