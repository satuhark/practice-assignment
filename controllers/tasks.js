const tasksRouter = require('express').Router()
const Task = require('../models/task')

tasksRouter.get('/', async (req, res, next) => {
    try {const tasks = await Task.find({})
        res.status(200).json(tasks)
    } catch(error) {
        next(error)
    }
})

tasksRouter.get('/:id', async (req, res, next) => {
    try { const task = await Task.findById(req.params.id)
        task ? res.json(task) : res.status(404).end()
    } catch(error) {
        next(error)
    }
})

tasksRouter.post('/', async (req, res, next) => {
    try {
        const body = req.body
        const task = await Task.create(body)
        if (!body.name || !body.description || !body.deadline || !body.status) {
            return res.status(400).json({ error: 'content missing' })
        }
        res.status(201).json(task)
    } catch(error) {
        next(error)
    }
})

tasksRouter.put('/:id', async (req, res, next) => {
    try {
        const body = req.body
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, body, { new: true })
        res.json(updatedTask)
    } catch(error) {
        next(error)
    }
})

tasksRouter.delete('/:id', async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        const message = task ? 'Task deleted successfully' : 'Task not found'
        const status = task ? 200 : 404
        res.status(status).json({ message })
    } catch(error) {
        next(error)
    }
})

module.exports = tasksRouter