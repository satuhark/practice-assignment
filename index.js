require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Task = require('./models/task')

app.use(express.json())
app.use(cors())

app.get('/api/tasks', (req, res, next) => {
    Task.find({})
        .then(tasks => {
            res.status(200).json(tasks)
        })
        .catch(error => next(error))
})

app.get('/api/tasks/:id', (req, res, next) => {
    Task.findById(req.params.id)
        .then(task => {
            task ? res.json(task) : res.status(404).end()
        })
        .catch(error => next(error))
})

app.post('/api/tasks', (req, res, next) => {
    const body = req.body
    Task.create(body)
        .then(task => {
            res.status(201).json(task)
        })
        .catch(error => next(error))
})

app.put('/api/tasks/:id', (req, res, next) => {
    const body = req.body
    Task.findByIdAndUpdate(req.params.id, body, { new: true })
    .then(updatedTask => {
        res.json(updatedTask)
    })
    .catch(error => next(error))
})

app.delete('/api/tasks/:id', (req, res, next) => {
    Task.findByIdAndDelete(req.params.id)
    .then(task => {
        const message = task ? 'Task deleted successfully' : 'Task not found'
        const status = task ? 200 : 404
        res.status(status).json({ message })
    })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    next(error)
  }
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)