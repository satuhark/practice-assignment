import { render, screen } from '@testing-library/react'
import App from '../App'

test('Login button exists', () => {
  render(<App />)
  screen.getByRole('button', { name: 'Login' })
})

test('Login fields exist', () => {
    render(<App />)
    screen.getByPlaceholderText('Username')
    screen.getByPlaceholderText('Password')
  })

test('Register button exists', () => {
    render(<App />)
    screen.getByRole('button', { name: 'Register' })
  })

  test('Register fields exist', () => {
    render(<App />)
    screen.getByPlaceholderText('New username')
    screen.getByPlaceholderText('New name')
    screen.getByPlaceholderText('New password')
    screen.getByPlaceholderText('Confirm new password')
  })