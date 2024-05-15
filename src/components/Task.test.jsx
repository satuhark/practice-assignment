import { render, screen, test, expect } from '@testing-library/react'
import App from './App'

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

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})