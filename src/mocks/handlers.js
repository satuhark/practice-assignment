import { rest } from 'msw'

console.log('Initializing MSW Handlers')

/*
export const handlers = [
    rest.post('http://localhost:3001/api/tasks', (req, res, ctx) => {
      return res(
        ctx.status(201),
        ctx.json({
          message: 'Task added successfully',
          task: {
            id: 1,
            name: 'Mocked Task',
            description: 'Mocked Description',
            deadline: '2024-05-25',
            status: 'To Do',
            createdBy: 'user1',
            assignedTo: ''
          }
        })
      )
    }),
  ]
*/
  
//console.log('Exporting MSW Server:', server)