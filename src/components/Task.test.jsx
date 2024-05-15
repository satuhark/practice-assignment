import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import Login from '../Login'

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

  test('logging in', async () => {

    const mockHandler = vi.fn()

    render(<Login setUser={mockHandler} />)

    const user = userEvent.setup()

    const usernameInput = screen.getByPlaceholderText('Username')
    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
    
    expect(usernameInput).toHaveValue('testuser')
    expect(passwordInput).toHaveValue('testpassword')
    
    const loginButton = screen.getByRole('button', { name: 'Login' })
    
    await user.click(loginButton)
    screen.getByText(`testuser logged in`)
    /*expect(usernameInput).toHaveValue('')
    expect(passwordInput).toHaveValue('')*/
    
  }
)