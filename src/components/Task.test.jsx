import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import Login from '../Login'
import loginService from '../services/login'
import { vi } from 'vitest'


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
  
  screen.debug()
  
  const loggedInUser = 'testuser'
  const createdBy = screen.getByText(`Created By: ${loggedInUser}`)
  expect(createdBy).toBeInTheDocument()

  expect(window.alert).not.toHaveBeenCalled()
  
  vi.resetAllMocks()
})



/*test('Task is added and displayed under "Tasks"', async () => {
  render(<App />)

  const taskNameInput = screen.getByPlaceholderText('Task Name')
  const taskDescriptionInput = screen.getByPlaceholderText('Task Description')
  const addTaskButton = screen.getByRole('button', { name: 'Add task' })

  userEvent.type(taskNameInput, 'Test Task 1')
  userEvent.type(taskDescriptionInput, 'Description 1')

  userEvent.click(addTaskButton)

  await waitFor(() => {
    //expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    //expect(screen.getByText('Description 1')).toBeInTheDocument()
  })

  const tasksHeader = screen.getByText('Tasks')
  expect(tasksHeader).toBeInTheDocument()

  const deadline = screen.getByPlaceholderText('Select deadline')
  expect(deadline).toBeInTheDocument()

  //const status = screen.getByText('Status')
  //expect(status).toBeInTheDocument()

  //const createdBy = screen.getByText(`Created By: ${loggedInUser}`)
  //expect(createdBy).toBeInTheDocument()

  const assignedTo = screen.getByText('Assigned To: ')
  expect(assignedTo).toBeInTheDocument()
  

})
*/