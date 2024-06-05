const tasksRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Task = require('../models/task')
const User = require('../models/user')

tasksRouter.get('/', async (req, res) => {
    const tasks = await Task.find({})
        res.status(200).json(tasks)
        tasks.forEach(task => {
          console.log('Task:', task)
          if (!task.description || !task.deadline || !task.status) {
            console.error('Invalid task found:', task)
          }
        })
        res.json(tasks)
})

tasksRouter.get('/:id', async (req, res) => {
    const task = await Task.findById(req.params.id)
        task ? res.json(task) : res.status(404).end()
})

const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }

tasksRouter.post('/', async (req, res) => {
        const body = req.body
        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
        if (!decodedToken.id) {
            return res.status(401).json({ error: 'token invalid' })
        }
        const user = await User.findById(decodedToken.id)
        if (!user) {
          return res.status(404).json({ error: 'User not found' })
        }
        if (!body.name || !body.description || !body.deadline) {
            return res.status(400).json({ error: 'content missing' })
        }
        const task = new Task({
            name: body.name,
            description: body.description,
            status: body.status,
            deadline: body.deadline,
            createdby: body.createdby
          })
        
        const savedTask = await task.save()
        user.tasks = user.tasks.concat(savedTask._id)
        await user.save()
        res.status(201).json(savedTask)
})

tasksRouter.put('/:id', async (req, res) => {
        const { id } = req.params
        const body = req.body
        const existingTask = await Task.findById(id)
        existingTask.name = body.name || existingTask.name
        existingTask.description = body.description || existingTask.description
        existingTask.status = body.status || existingTask.status
        existingTask.deadline = body.deadline || existingTask.deadline
        const updatedTask = await existingTask.save()
        res.json(updatedTask)
})

tasksRouter.delete('/:id', async (req, res) => {
        const task = await Task.findByIdAndDelete(req.params.id)
        const message = task ? 'Task deleted successfully' : 'Task not found'
        const status = task ? 200 : 404
        res.status(status).json({ message })
})

module.exports = tasksRouter