import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import Login from '../Login'
import loginService from '../services/login'
import DatePicker from '../DatePicking'

vi.mock('../services/login')

describe('App Component', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('Login fields and button exists', () => {
    render(<App />)
    screen.getByRole('button', { name: 'Login' })
    screen.getByPlaceholderText('Username')
    screen.getByPlaceholderText('Password')
  })

  it('Register fields and button exists', () => {
    render(<App />)
    screen.getByRole('button', { name: 'Register' })
    screen.getByPlaceholderText('New username')
    screen.getByPlaceholderText('New name')
    screen.getByPlaceholderText('New password')
    screen.getByPlaceholderText('Confirm new password')
  })

  it('Login displays error message for invalid credentials', async () => {
    const setUser = vi.fn()

    loginService.login = vi.fn().mockRejectedValue({ response: { status: 401 } })

    render(<Login setUser={setUser} />)

    userEvent.type(screen.getByPlaceholderText('Username'), 'testuser')
    userEvent.type(screen.getByPlaceholderText('Password'), 'invalidpassword')

    userEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByText('User or password incorrect')).to.exist
    })

    expect(setUser).not.toHaveBeenCalled()
  })

  it('Logging in works', async () => {
    const setUser = vi.fn()
    window.alert = vi.fn()

    loginService.login.mockResolvedValue({
      username: 'testuser',
      token: 'mocked_token',
    })

    render(<Login setUser={setUser} />)

    userEvent.type(screen.getByPlaceholderText('Username'), 'testuser')
    userEvent.type(screen.getByPlaceholderText('Password'), 'testpassword')

    userEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(setUser).toHaveBeenCalledWith({
        username: 'testuser',
        token: 'mocked_token',
      })
    })

    expect(window.alert).not.toHaveBeenCalled()
  })
})

  it('Task is added and displayed under "Tasks"', async () => {
    render(<App />)
    //render(<DatePicker />)

    userEvent.type(screen.getByPlaceholderText('Task Name'), 'Test Task 1')
    userEvent.type(screen.getByPlaceholderText('Task Description'), 'Description 1')
    
    await waitFor(() => {
      const deadlineInputs = screen.getAllByPlaceholderText('Select deadline')
      const deadlineInput = deadlineInputs[0]
      userEvent.click(deadlineInput)
      const todayButton = screen.getByText('Today')
      userEvent.click(todayButton)
    })

    userEvent.click(screen.getByRole('button', { name: 'Add task' }))

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      expect(screen.getByText('Description 1')).toBeInTheDocument()
    })
  })
  
/*
  it('User can delete a task', async () => {
    render(<App />)

    userEvent.click(screen.getByRole('button', { name: 'Delete Task' }))

    await waitFor(() => {
      expect(screen.queryByText('Deleted Task')).toBeNull()
    })
  })

  it('Logout button logs the user out', async () => {
    const setUser = vi.fn()

    render(<App />)

    userEvent.click(screen.getByRole('button', { name: 'Logout' }))

    await waitFor(() => {
      expect(setUser).toHaveBeenCalledWith(null)
    })
  })
})
*/






/*import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import Login from '../Login'
import loginService from '../services/login'
import axios from 'axios'
import { server } from '../mocks/server'
import { http } from 'msw'



server.use(
  http.post('http://localhost:3002/api/tasks', (req, res, ctx) => {
    return res(ctx.json({ message: 'Mocked response for tasks' }))
  })
)

describe('Task Component', () => {
  it('Mock server responds with expected data', async () => {
    const response = await axios.post('http://localhost:3002/api/tasks')
    expect(response.data).toEqual({ message: 'Mocked response for tasks' })
  })
})

test('Mock server responds with expected data', async () => {
  const response = await http.post('http://localhost:3002/api/test')
  expect(response.data).toEqual({ message: 'Mocked response for testing' })
})


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

test('Login displays error message for invalid credentials', async () => {
  const setUser = vi.fn()
  window.alert = vi.fn()

  loginService.login = vi.fn().mockRejectedValue(new Error('Invalid credentials'))

  render(<Login setUser={setUser} />)

  const usernameInput = screen.getByPlaceholderText('Username')
  const passwordInput = screen.getByPlaceholderText('Password')

  userEvent.type(usernameInput, 'testuser')
  userEvent.type(passwordInput, 'invalidpassword')

  const loginButton = screen.getByRole('button', { name: 'Login' })
  userEvent.click(loginButton)

  await waitFor(() => {
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  expect(setUser).not.toHaveBeenCalled()
  expect(window.alert).not.toHaveBeenCalled()

  vi.clearAllMocks()
})

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
  
  vi.clearAllMocks()
})


test('Task is added and displayed under "Tasks"', async () => {
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

  //const tasksHeader = screen.getByText('Tasks')
  //expect(tasksHeader).toBeInTheDocument()

  //const deadline = screen.getByPlaceholderText('Select deadline')
  //expect(deadline).toBeInTheDocument()

  //const status = screen.getByText('Status')
  //expect(status).toBeInTheDocument()

  //const createdBy = screen.getByText(`Created By: ${loggedInUser}`)
  //expect(createdBy).toBeInTheDocument()

  //const assignedTo = screen.getByText('Assigned To: ')
  //expect(assignedTo).toBeInTheDocument()
  

})

test('User can delete a task', async () => {
  render(<App />)

  const deleteButton = screen.getByRole('button', { name: 'Delete Task' })
  userEvent.click(deleteButton)

  await waitFor(() => {
    expect(screen.queryByText('Deleted Task')).toBeNull()
  })
})


test('Logout button logs the user out', async () => {
  const setUser = vi.fn()

  render(<App />)

  const logoutButton = screen.getByRole('button', { name: 'Logout' })
  userEvent.click(logoutButton)

  await waitFor(() => {
    expect(setUser).toHaveBeenCalledWith(null)
  })
})
*/