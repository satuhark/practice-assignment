import { useState, useEffect } from 'react'
import axios from 'axios'
import Delete from './Delete'
import Modify from './Modify'
import './index.css'

const Add = () => {
    const [tasks, setTasks] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')
    const [status, setStatus] = useState('')

    useEffect(() => {
        axios
          .get('http://localhost:3001/tasks')
          .then(response => {
            console.log('promise fulfilled')
            setTasks(response.data)
          })
      }, [])

    const addTask = event => {
        event.preventDefault()
        const newTask = {
            id: tasks.length + 1,
            name: name,
            description: description,
            deadline: deadline,
            status: status,
        }
        axios
        .post('http://localhost:3001/tasks', newTask)
        .then(response => {
            console.log(response)
        })
        console.log('New Task:', newTask)
        setTasks([...tasks, newTask])
        setName('')
        setDescription('')
        setDeadline('')
        setStatus('')
    }

    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId))
    }

    const modifyTask = (modifiedTask) => {
        const updatedTasks = tasks.map(task =>
            task.id === modifiedTask.id ? modifiedTask : task
        );
        setTasks(updatedTasks)
    }

    return (
        <div className="add-container">
            <h2>Add a task</h2>
            <div className="input-field">
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
            </select></div>
            <button className="button" onClick={addTask}>Add task</button>

            <div>
                {tasks.map(task => (
                    <p key={task.id}>
                        <div>Task: {task.name}</div>
                        <div>Description: {task.description}</div>
                        <div>Deadline: {task.deadline}</div>
                        <div>Status: {task.status}</div>
                        <Delete id={task.id} onDelete={deleteTask} />
                        <Modify task={task} onModify={modifyTask} /><br/>
                    </p>
                ))}
            </div>
        </div>
    )
}

export default Add