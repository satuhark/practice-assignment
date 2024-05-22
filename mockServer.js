const express = require('express')
const app = express()
const PORT = 3002

app.use(express.json())

app.post('/api/test', (req, res) => {
    res.json({ message: 'Mocked response for testing' })
})

const server = app.listen(PORT, () => {
    console.log(`Mock server is running on http://localhost:${PORT}`)
})

module.exports = server