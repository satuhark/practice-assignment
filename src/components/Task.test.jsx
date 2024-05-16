import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'
import Login from '../Login'
import * as loginService from '../services/login'

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

  vi.mock('../services/login')

  test('logging in', async () => {
    
    const setUser = vi.fn()
    window.alert = vi.fn()
    render(<Login setUser={setUser} />)

    const usernameInput = screen.getByPlaceholderText('Username')
    const passwordInput = screen.getByPlaceholderText('Password')
    userEvent.type(usernameInput, 'testuser')
    userEvent.type(passwordInput, 'testpassword')
    
    const loginButton = screen.getByRole('button', { name: 'Login' })
    userEvent.click(loginButton)

    const mockUser = {
      username: 'testuser',
      token: 'mocked_token',
    }
    setUser(mockUser)
    expect(setUser).toHaveBeenCalledWith(mockUser)
  })