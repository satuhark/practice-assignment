const Task = require('../models/task')

const initialTasks = [
    {
        name: "HTML is easy",
        description: "",
        deadline: "",
        status: ""
    },
    {
        name: "Browser can execute only JavaScript",
        description: "",
        deadline: "",
        status: ""
    },
  ]

const nonExistingId = async () => {
  const task = new Task({ name: 'willremovethissoon' })
  await task.save()
  await task.deleteOne()

  return task._id.toString()
}

const tasksInDb = async () => {
  const tasks = await Task.find({})
  return tasks.map(task => task.toJSON())
}

module.exports = {
  initialTasks, nonExistingId, tasksInDb
}