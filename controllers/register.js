const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const registerRouter = express.Router()

registerRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body
    if (!username || !name || !password) {
        return res.status(400).json({ error: 'Username, name, or password missing' })
    }
    if (password !== req.body.confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' })
    }
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            username,
            name,
            password: hashedPassword
        })

        await newUser.save()
        res.status(201).json(newUser)
    }
)

module.exports = registerRouter
