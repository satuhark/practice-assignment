import { render, screen } from '@testing-library/react'
//import { test } from '@jest/globals'
import App from '../App'

test('renders content', () => {
  const task = {
    name: "VVVVVVVVVV",
    description: "klkl",
    deadline: "2024-06-07T21:00:00.000Z",
    status: "Completed",
    createdby: "satu",
    assignedTo: "David",
  }

  render(<App task={task} />)

    const buttonElement = screen.getByRole('button', { name: 'Login' });
    expect(buttonElement).toBeInTheDocument()
})