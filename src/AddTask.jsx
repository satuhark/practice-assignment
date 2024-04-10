import { useState } from 'react'
import Delete from './Delete'

const Add = () => {
    const [tasks, setTasks] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')
    const [status, setStatus] = useState('')

    const addTask = () => {
        const taskObject = {
            name: name,
            description: description,
            deadline: deadline,
            status: status,
        }
        console.log('New Task:', taskObject)
        setTasks([...tasks, taskObject])
        setName('')
        setDescription('')
        setDeadline('')
        setStatus('')
    }
    return (
        <div>
            <h2>Add a task</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Task Name"
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task Description"
            />
            <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="Task Deadline"
            />
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="">Select Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
            </select>
            <button onClick={addTask}>Add</button>

            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <div>Name: {task.name}</div>
                        <div>Description: {task.description}</div>
                        <div>Deadline: {task.deadline}</div>
                        <div>Status: {task.status}</div>
                        <Delete/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Add