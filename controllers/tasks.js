const tasksRouter = require('express').Router()
const Task = require('../models/task')

tasksRouter.get('/', (req, res, next) => {
    Task.find({})
        .then(tasks => {
            res.status(200).json(tasks)
        })
        .catch(error => next(error))
})

tasksRouter.get('/:id', (req, res, next) => {
    Task.findById(req.params.id)
        .then(task => {
            task ? res.json(task) : res.status(404).end()
        })
        .catch(error => next(error))
})

tasksRouter.post('/', (req, res, next) => {
    const body = req.body
    Task.create(body)
        .then(task => {
            res.status(201).json(task)
        })
        .catch(error => next(error))
})

tasksRouter.put('/:id', (req, res, next) => {
    const body = req.body
    Task.findByIdAndUpdate(req.params.id, body, { new: true })
    .then(updatedTask => {
        res.json(updatedTask)
    })
    .catch(error => next(error))
})

tasksRouter.delete('/:id', (req, res, next) => {
    Task.findByIdAndDelete(req.params.id)
    .then(task => {
        const message = task ? 'Task deleted successfully' : 'Task not found'
        const status = task ? 200 : 404
        res.status(status).json({ message })
    })
        .catch(error => next(error))
})

module.exports = tasksRouter