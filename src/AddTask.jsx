import { useState, useEffect } from 'react'
import axios from 'axios'
import DatePicking from './DatePicking'
import './index.css'
import TaskOptions from './TaskOptions'

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
        fetchTasks()
    }, [])

    useEffect(() => {
    const checkForOverdueTasks = async () => {
        try {
            const response = await axios.get(baseUrl)
            const tasks = response.data
          
            const currentDate = new Date()
            
            tasks.forEach(async (task) => {
                if (task.status === 'To Do' && new Date(task.deadline) < currentDate) {
                    const updatedTask = { ...task, status: 'Overdue' }
                    await axios.put(`${baseUrl}/${task.id}`, updatedTask)
                    setTasks((prevTasks) => prevTasks.map((t) => (t.id === task.id ? updatedTask : t)))
                }
            })
        } catch (error) {
            console.error('Error updating task statuses:', error)
        }
    }

    checkForOverdueTasks()
    const intervalId = setInterval(checkForOverdueTasks, 3600000)

    return () => clearInterval(intervalId)
}, [])


    const validateInput = () => {
        if (!name.trim() || !description.trim() || !deadline || !status.trim()) {
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

    const acceptTask = (taskId) => {
        const acceptedTask = tasks.find(task => task.id === taskId)
        if (acceptedTask) {
            acceptedTask.status = "In Progress"
            setTasks(tasks.map(task => (task.id === taskId ? acceptedTask : task)))
            axios.put(`${baseUrl}/${taskId}`, acceptedTask)
                .then(response => {
                    console.log('Task status updated successfully:', response.data)
                })
                .catch(error => {
                    console.error('Error updating task status:', error)
                })
        }
    }
    
    const completeTask = (taskId) => {
        const completedTask = tasks.find(task => task.id === taskId)
        if (completedTask) {
            completedTask.status = "Completed"
            setTasks(tasks.map(task => (task.id === taskId ? completedTask : task)))
            axios.put(`${baseUrl}/${taskId}`, completedTask)
            .then(response => {
                console.log('Task status updated successfully:', response.data)
            })
            .catch(error => {
                console.error('Error updating task status:', error)
            })
        }
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
                
            </select></div>
            <button className="button" onClick={addTask}>Add task</button>

            <div>
                {tasks.map(task => (
                    <div key={task.id}>
                        <p><b>Task: {task.name}</b><br/>
                        Description: {task.description}<br/>
                        Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}<br/>
                        Status: {task.status}
                        <TaskOptions
                        task={{ ...task, id: +task.id }}
                        deleteTask={deleteTask}
                        modifyTask={modifyTask}
                        acceptTask={acceptTask}
                        completeTask={completeTask}/>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Add