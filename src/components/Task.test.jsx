import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import Login from '../Login'
import loginService from '../services/login'

test('Login fields and button exists', () => {
  render(<App />)
  screen.getByRole('button', { name: 'Login' })
  screen.getByPlaceholderText('Username')
  screen.getByPlaceholderText('Password')
})

test('Register fields and button exists', () => {
    render(<App />)
    screen.getByRole('button', { name: 'Register' })
    screen.getByPlaceholderText('New username')
    screen.getByPlaceholderText('New name')
    screen.getByPlaceholderText('New password')
    screen.getByPlaceholderText('Confirm new password')
  })
  
vi.mock('../services/login')

test('Logging in works', async () => {
  const setUser = vi.fn()
  window.alert = vi.fn()

  loginService.login = vi.fn().mockResolvedValue({
    username: 'testuser',
    token: 'mocked_token',
  })

  render(<Login setUser={setUser} />)

  const usernameInput = screen.getByPlaceholderText('Username')
  const passwordInput = screen.getByPlaceholderText('Password')
    
  userEvent.type(usernameInput, 'testuser')
  userEvent.type(passwordInput, 'testpassword')
    
  const loginButton = screen.getByRole('button', { name: 'Login' })
  userEvent.click(loginButton)

  await waitFor(() => {
    expect(setUser).toHaveBeenCalledWith({
      username: 'testuser',
      token: 'mocked_token',
    })
  })

  expect(window.alert).not.toHaveBeenCalled()
  
  vi.resetAllMocks()
})

test('Tasks show after logging in', async () => {
  // Mock localStorage for token storage
  Storage.prototype.getItem = vi.fn((key) => {
    if (key === 'token') return 'mocked_token'
    if (key === 'user') return JSON.stringify({ name: 'user1' })
    return null
  })

  render(<App />)

  // Simulate login, check if tasks are loaded
  await waitFor(() => {
    expect(screen.getByText('Tasks')).toBeInTheDocument()
  })

  // Check that the tasks are displayed
  expect(screen.getByText('Test Task 1')).toBeInTheDocument()
  expect(screen.getByText('Description 1')).toBeInTheDocument()
  expect(screen.getByText('Test Task 2')).toBeInTheDocument()
  expect(screen.getByText('Description 2')).toBeInTheDocument()
})
