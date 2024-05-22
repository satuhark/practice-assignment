import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

console.log('MSW Server is starting...')
beforeAll(() => {
    console.log('Server listening...')
    server.listen()
  })
afterEach(() => server.resetHandlers())
afterAll(() => server.close())