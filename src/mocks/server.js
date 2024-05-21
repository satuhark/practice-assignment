const { setupServer } = require('msw/node')
import { rest } from 'msw'

const handlers = [
    rest.post('/api/tasks', (req, res, ctx) => {
      return res(
        ctx.status(201),
        ctx.json({
          message: 'Task added successfully',
          task: {
            id: 1,
            name: 'Mocked Task',
            description: 'Mocked Description',
            deadline: '2024-05-25',
            status: 'To Do',
            createdBy: 'user1',
            assignedTo: ''
          }
        })
      )
    }),
  ]

  const server = setupServer(...handlers)

export default server
