import React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent, debug } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import Login from '../Login'
import loginService from '../services/login'
import DatePicker from '../DatePicking'
import Add from '../AddTask'

vi.mock('../services/login')

describe('Add Component', () => {
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

    console.log('HTML after logging in:', document.body.innerHTML)

    expect(window.alert).not.toHaveBeenCalled()
  })
})

/*
  it('Task is added and displayed under "Tasks"', async () => {
    window.alert = vi.fn()

    const mockTasks = [
      { id: 1, name: 'Task 1', description: 'Description 1', deadline: '2024-05-25', status: 'To Do', assignedTo: 'User 1', createdby: 'Creator 1' },
      { id: 2, name: 'Task 2', description: 'Description 2', deadline: '2024-05-26', status: 'In Progress', assignedTo: 'User 2', createdby: 'Creator 2' },
    ]

    render(<Add sortedTasks={mockTasks}/>)

    fireEvent.click(screen.getByPlaceholderText('Task Name'))
    fireEvent.change(screen.getByPlaceholderText('Task Name'), {
      target: { value: 'Test Task 1' }
    })
    expect(screen.getByPlaceholderText('Task Name').value).toBe('Test Task 1')


    fireEvent.click(screen.getByPlaceholderText('Task Description'))
    fireEvent.change(screen.getByPlaceholderText('Task Description'), {
      target: { value: 'Description 1'}
    })
    expect(screen.getByPlaceholderText('Task Description').value).toBe('Description 1')


    userEvent.click(screen.getByPlaceholderText('Select deadline'))
    await waitFor(() => {
      expect(screen.getByText('Today')).to.exist
    })
    const currentDateCell = screen.getByText(new Date().getDate().toString())
    userEvent.click(currentDateCell)
    

    fireEvent.click(screen.getByRole('button', { name: 'Add task' }))

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      expect(screen.getByText('Description 1')).toBeInTheDocument()
    })
  })

  

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






/*


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