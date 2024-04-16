import { useState, useEffect } from 'react'
import axios from 'axios'
import Delete from './Delete'
import Modify from './Modify'
import DatePicking from './DatePicking'
import './index.css'

const baseUrl = 'http://localhost:3001/api/tasks'

const Add = () => {
    const [tasks, setTasks] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState(null)
    const [status, setStatus] = useState('')

    const fetchTasks = () => {
        axios
        .get(baseUrl)
        .then(response => {
            console.log('promise fulfilled')
            setTasks(response.data)
        })
        .catch(error => {
            console.error('Error fetching tasks:', error)
        })
    }

    useEffect(() => {
        axios
          .get(baseUrl)
          .then(response => {
            console.log('promise fulfilled')
            setTasks(response.data)
          })
      }, [])
      
    useEffect(() => {
        fetchTasks()
    }, [])

    const validateInput = () => {
        if (!name.trim() || !description.trim() || !status.trim()) {
            alert('Please fill in all fields.')
            return false
        }
        return true
    }

    const clearFields = () => {
        setName('')
        setDescription('')
        setDeadline(null)
        setStatus('')
    }

    const addTask = event => {
        event.preventDefault()
        if (!validateInput()) return
        
        const newTask = {
            name: name,
            description: description,
            deadline: deadline,
            status: status,
        }
        axios
        .post(baseUrl, newTask)
        .then(response => {
            console.log(response)
            fetchTasks()
            setTasks(prevTasks => [...prevTasks, response.data])
            clearFields()
        })
        .catch(error => {
            console.error('Error adding task:', error)
        }) 
    }
    
    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId))
    }

    const modifyTask = (modifiedTask) => {
        const updatedTasks = tasks.map(task =>
            task.id === modifiedTask.id ? modifiedTask : task
        )
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
            <DatePicking
                selectedDate={deadline}
                setSelectedDate={setDeadline}
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
                    <div key={task.id}>
                        <p><b>Task: {task.name}</b><br/>
                        Description: {task.description}<br/>
                        Deadline: {task.deadline}<br/>
                        Status: {task.status}</p>
                        <Delete id={task.id.toString()} name={task.name} onDelete={deleteTask} />
                        <Modify task={task} onModify={modifyTask} /><br/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Add