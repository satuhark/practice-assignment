const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: 'Invalid username or password' })
      }


  const token = jwt.sign(
    { username: user.username,
    id: user._id },
    process.env.SECRET,
    { expiresIn: '1h' }
  )

  res
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter