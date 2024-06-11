import { http } from 'msw'

console.log('Initializing MSW Handlers')

export const handlers = [
    http.options('https://practice-assignment-1.onrender.com/api/tasks', (req, res, ctx) => {
        return res(
            ctx.set('Access-Control-Allow-Origin', '*'),
            ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'),
            ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'),
            ctx.status(200)
        )
    }),
    http.post('https://practice-assignment-1.onrender.com/api/tasks', (req, res, ctx) => {
      return res(ctx.json({ message: 'Mocked response for tasks' }))
    }),
    http.get('https://practice-assignment-1.onrender.com/api/tasks', (req, res, ctx) => {
        return res(ctx.json({ message: 'Mocked response for GET request to /api/tasks'}))
    })
  ]
  
console.log('Exporting MSW Handlers:', handlers)