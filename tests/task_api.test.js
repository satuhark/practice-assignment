const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Task = require('../models/task')
const User = require('../models/user')

describe('User registration and login', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('a valid user can be created', async () => {
    const newUser = {
      username: "test",
      name: "test",
      password: "test"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('user can log in with correct credentials', async () => {
    const newUser = {
      username: "test",
      name: "test",
      password: "test"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const loginResponse = await api
      .post('/api/login')
      .send({ username: "test", password: "test" })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(loginResponse.body.token)
  })
})

describe('Adding tasks', () => {
  let token = ''
  beforeEach(async () => {
    await User.deleteMany({})
    await Task.deleteMany({})
    
    await api.post('/api/users').send({ username: "test", name: "test", password: "test" })
    
    const loginResponse = await api
    .post('/api/login')
    .send({ username: "test", password: "test" })
  
  token = loginResponse.body.token
})

  test('a valid task can be added ', async () => {
    const initialTasks = await helper.tasksInDb()

      const newTask = {
          name: 'name',
          description: "jdsks",
          deadline: "22.04.2024",
          status: "To Do",
          userId: ""
      }

      await api
          .post('/api/tasks')
          .set('Authorization', `Bearer ${token}`)
          .send(newTask)
          .expect(201)
          .expect('Content-Type', /application\/json/)

          const tasksAtEnd = await helper.tasksInDb()
          assert.strictEqual(tasksAtEnd.length, initialTasks.length + 1)
          const names = tasksAtEnd.map(n => n.name)
          assert(names.includes('name'))
      })

  test('task without name is not added', async () => {
    const initialTasks = await helper.tasksInDb()
    
    const newTask = {
          description: "jdsks",
      }

      await api
          .post('/api/tasks')
          .set('Authorization', `Bearer ${token}`)
          .send(newTask)
          .expect(400)
          
          const tasksAtEnd = await helper.tasksInDb()
          assert.strictEqual(tasksAtEnd.length, initialTasks.length)
  })
})

describe('Returning tasks', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Task.deleteMany({})
    
    await api.post('/api/users').send({ username: "test", name: "test", password: "test" })
    
    const loginResponse = await api
      .post('/api/login')
      .send({ username: "test", password: "test" })
  
    const token = loginResponse.body.token

    const newTask = {
      name: 'name',
      description: "jdsks",
      deadline: "22.04.2024",
      status: "To Do",
      userId: ""
    }

    await api
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(newTask)
      .expect(201)
  })

    test('tasks are returned as json', async () => {
      await api
        .get('/api/tasks')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      })


    test('a specific task is within the returned tasks', async () => {
      const response = await api.get('/api/tasks')
        const names = response.body.map(r => r.name)
        assert(names.includes('name'))
    })
})

after(async () => {
  await mongoose.connection.close()
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
        assert.strictEqual(tasksAtEnd.length, tasksAtStart.length - 1)
  })
})