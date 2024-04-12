const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

    let tasks = [
      {
        "id": "3",
        "name": "jksfd",
        "despcription": "lalal",
        "deadline": "10.4.2024kkk",
        "status": "To Do",
        "description": "hkhjvgfyur6u7987908"
      },
      {
        "id": "4",
        "name": "satu",
        "description": "satummm",
        "deadline": "daskjadsjkl",
        "status": ""
      },
      {
        "id": "2",
        "name": "dmasq",
        "description": "askm",
        "deadline": "admk",
        "status": "To Do"
      },
      {
        "id": "5",
        "name": "adskjp",
        "description": "fjiooi",
        "deadline": "adfj",
        "status": ""
      }
    ]
    
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
    })

app.options('*', (req, res) => {
    res.status(200).end()
})

app.get('/api/tasks', (request, response) => {
    response.json(tasks)
  })

app.post('/api/tasks', (req, res) => {
    const newTask = req.body
    tasks.push(newTask);
    res.status(201).json(newTask)
})

app.put('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id
    const updatedTask = req.body
    const index = tasks.findIndex(task => task.id === taskId)
    if (index !== -1) {
        tasks[index] = updatedTask
        res.status(200).json(updatedTask)
    } else {
        res.status(404).json({ error: 'Task not found' })
    }
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)