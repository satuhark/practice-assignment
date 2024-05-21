const { setupServer } = require('msw/node')

const server = setupServer(
    (req, res, ctx) => {
      if (req.method === 'POST' && req.url.pathname === '/api/tasks') {
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
      }
      return res(ctx.status(404))
    }
  )

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

export default server
