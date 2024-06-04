const { execSync } = require('child_process')
require('dotenv').config()

module.exports = async () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'test'

}
