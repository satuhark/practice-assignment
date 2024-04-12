const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use(bodyParser.json())

const password = process.argv[2]
const url = `mongodb+srv://satumharkonen:${password}@cluster0.r4cnza1.mongodb.net/taskApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const taskSchema = new mongoose.Schema({
        name: String,
        description: String,
        deadline: String,
        status: String,
})
    
const Task = mongoose.model('Task', taskSchema)
    
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
    })

app.options('*', (req, res) => {
    res.status(200).end()
})

app.get('/api/tasks', (req, res) => {
    Task.find({})
        .then(tasks => {
            res.json(tasks)
        })
        .catch(error => {
            res.status(500).json({ error: error.message })
        })
})

app.post('/api/tasks', (req, res) => {
    const newTask = req.body
    Task.create(newTask)
        .then(task => {
            res.status(201).json(task)
        })
        .catch(error => {
            res.status(400).json({ error: error.message })
        })
})

app.put('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id
    const updatedTask = req.body
    Task.findByIdAndUpdate(taskId, updatedTask, { new: true })
        .then(task => {
            if (task) {
                res.status(200).json(task)
            } else {
                res.status(404).json({ error: 'Task not found' })
            }
        })
        .catch(error => {
            res.status(400).json({ error: error.message })
        })
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)