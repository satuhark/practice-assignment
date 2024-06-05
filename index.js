require('dotenv').config()
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

const PORT = process.env.PORT || 3001

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${config.PORT}`)
})

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}