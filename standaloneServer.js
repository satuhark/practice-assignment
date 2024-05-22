// standaloneServer.js
import { setupServer } from 'msw/node'
import { handlers } from './src/mocks/handlers.js'

const server = setupServer(...handlers)

server.listen({ onUnhandledRequest: 'bypass' })
console.log('Standalone server is running...')