import { server } from './src/mocks/server'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

const { exec } = require('child_process')

beforeAll(() => {
    exec('node mockServer.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting mock server: ${error}`)
        return
      }
      console.log(`Mock server stdout: ${stdout}`)
      console.error(`Mock server stderr: ${stderr}`)
    })
  })

afterEach(() => {
    console.log('Resetting handlers and cleaning up')
    server.resetHandlers()
    cleanup()
  })

  afterAll(() => {
    console.log('Closing server')
    server.close()
  })