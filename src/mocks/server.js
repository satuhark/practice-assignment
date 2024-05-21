import { setupServer } from 'msw/node'
import { rest } from 'msw'

const handlers = [
  rest.get('http://localhost:3001/api/tasks', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'Test Task 1', description: 'Description 1', deadline: '2024-05-21T00:00:00Z', status: 'To Do', assignedTo: null, createdby: 'user1' },
        { id: 2, name: 'Test Task 2', description: 'Description 2', deadline: '2024-05-22T00:00:00Z', status: 'In Progress', assignedTo: 'user1', createdby: 'user1' }
      ])
    )
  })
]

const server = setupServer(...handlers)

export { server, rest }
