const express = require('express')
const app = express()
const PORT = 3002

app.get('/api/test', (req, res) => {
  res.json({ message: 'Mocked response for testing' })
})

app.listen(PORT, () => {
  console.log(`Mock server is running on http://localhost:${PORT}`)
})
