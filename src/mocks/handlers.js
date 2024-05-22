import { setupServer } from 'msw/node';
import { rest } from 'msw'

console.log('Initializing MSW Handlers')

export const handlers = setupServer(
  rest.post('http://localhost:3002/api/tasks', (req, res, ctx) => {
    return res(ctx.json({ message: 'Mocked response for tasks' }))
  }),
)

console.log('Exporting MSW Server:', server)