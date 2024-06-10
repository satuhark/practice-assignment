const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://satumharkonen:${password}@cluster0.r4cnza1.mongodb.net/testingTaskApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB')

const taskSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Task = mongoose.model('Task', taskSchema)

const task = new Task({
  content: 'HTML is easy',
  important: true,
})

task.save().then(result => {
  console.log('task saved!')
  mongoose.connection.close()
})
})

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
})