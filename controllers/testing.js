const router = require('express').Router()
const Task = require('../models/task')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Task.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router