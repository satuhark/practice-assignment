const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deadline: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Completed", "Cancelled", "Overdue", "Due today"],
        default: 'To Do'
    },
    assignedTo: String,
    createdby: String,
    user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
})

taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Task', taskSchema)