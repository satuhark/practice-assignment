const tasksRouter = require('express').Router()
const Task = require('../models/task')
const User = require('../models/user')

tasksRouter.get('/', async (req, res) => {
    const tasks = await Task.find({})
        res.status(200).json(tasks)
})

tasksRouter.get('/:id', async (req, res) => {
    const task = await Task.findById(req.params.id)
        task ? res.json(task) : res.status(404).end()
})

tasksRouter.post('/', async (req, res) => {
        const body = req.body
        const user = await User.findById(body.userId)
        if (!body.name || !body.description || !body.deadline || !body.status) {
            return res.status(400).json({ error: 'content missing' })
        }
        const task = new Task({
            name: body.name,
            description: body.description,
            status: body.status,
            deadline: body.deadline,
            user: user.id
          })
        
        const savedTask = await task.save()
        user.tasks = user.tasks.concat(savedTask._id)
        await user.save()
        res.status(201).json(task)
})

tasksRouter.put('/:id', async (req, res) => {
        const body = req.body
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, body, { new: true })
        res.json(updatedTask)
})

tasksRouter.delete('/:id', async (req, res) => {
        const task = await Task.findByIdAndDelete(req.params.id)
        const message = task ? 'Task deleted successfully' : 'Task not found'
        const status = task ? 200 : 404
        res.status(status).json({ message })
})

module.exports = tasksRouter