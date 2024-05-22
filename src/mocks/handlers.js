import { http } from 'msw'

console.log('Initializing MSW Handlers')

export const handlers = [
    http.post('http://localhost:3002/api/tasks', (req, res, ctx) => {
      return res(ctx.json({ message: 'Mocked response for tasks' }))
    }),
    http.get('http://localhost:3002/api/tasks', (req, res, ctx) => {
        return res(ctx.json({ message: 'Mocked response for GET request to /api/tasks'}))
    })
  ]
  
console.log('Exporting MSW Handlers:', handlers)