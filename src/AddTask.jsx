import { useState, useEffect } from 'react'
import axios from 'axios'
import DatePicking from './DatePicking'
import './index.css'
import TaskOptions from './TaskOptions'
import Login from './Login'
import Register from './Register'

const baseUrl = 'http://localhost:3001/api/tasks'

const Add = () => {
    const [tasks, setTasks] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState(null)
    const [showHistory, setShowHistory] = useState(false)
    const [buttonText, setButtonText] = useState('Completed Tasks')
    const [user, setUser] = useState(null)
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setLoggedIn(true)
        }
    }, [])
    
   const fetchTasks = async () => {
    try {
        const response = await axios.get(baseUrl)
            console.log('fetches tasks succesfully')
            setTasks(response.data)
        } catch (error) {
            console.error('Error fetching tasks:', error)
        }
    }
    
    useEffect(() => {
        fetchTasks()
    }, [])

    useEffect(() => {
        const checkForOverdueTasks = async () => {
            try {
                const currentDate = new Date()
                const updatedTasks = await Promise.all(tasks.map(async (task) => {
                    const taskDeadline = new Date(task.deadline)
                    
                    if (areDatesEqual(currentDate, taskDeadline)) {
                        const updatedTask = { ...task, status: 'Due today' }
                        await axios.put(`${baseUrl}/${task.id}`, updatedTask)
                        return updatedTask
                    } else if (currentDate > taskDeadline) {
                        const updatedTask = { ...task, status: 'Overdue' }
                        await axios.put(`${baseUrl}/${task.id}`, updatedTask)
                        return updatedTask
                    } else {
                    return task
                }
                }))
                if (updatedTasks.length !== tasks.length) {
                    setTasks(updatedTasks)
                }
            } catch (error) {
                console.error('Error updating task statuses:', error)
            }
        }
        checkForOverdueTasks()
    }, [tasks])

    useEffect(() => {
        fetchTasks()
    }, [showHistory])

    const toggleHistory = () => {
        setShowHistory(!showHistory)
        setButtonText(showHistory ? 'Completed Tasks' : 'Hide Completed Tasks')
    }

    const areDatesEqual = (date1, date2) => {
        return date1.toDateString() === date2.toDateString()
    }
    
    const sortedTasks = tasks.slice().sort((a, b) => {
        const dateA = new Date(a.deadline)
        const dateB = new Date(b.deadline)
        return dateA - dateB
    })

    const validateInput = () => {
        if (!name.trim() || !description.trim() || !deadline) {
            alert('Please fill in all fields.')
            return false
        }
        return true
    }

    const clearFields = () => {
        setName('')
        setDescription('')
        setDeadline(null)
    }

    const addTask = event => {
        event.preventDefault()
        if (!validateInput()) return
        
        const newTask = {
            name: name,
            description: description,
            deadline: deadline,
            status: "To Do",
            user: user.id
        }

        const token = localStorage.getItem('token')
        if (!token) {
            console.error('Token not found')
            return
        }

        axios
        .post(baseUrl, newTask, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
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
            acceptedTask.assignedTo = user.name
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

    const taskForm = () => (
        <div className="add-container">
            <h2>Add a task</h2>
            <div className="input-field">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Task Name" />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task Description" />
                <DatePicking
                    selectedDate={deadline}
                    setSelectedDate={setDeadline} />
                <button className="button" onClick={addTask}>Add task</button>
            </div>
        </div>
        )

        const updateUser = (userData) => {
            setUser(userData)
        }

        const formatDate = (dateString) => {
            const date = new Date(dateString)
            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const year = date.getFullYear()
            return `${day}/${month}/${year}`
        }

        return (
            <>
                {user === null ? (
                    <div>
                        <Login setUser={updateUser}  />
                        <Register/>
                    </div>
                ) : (
                    <div>
                        <p>{user.name} logged in {loggedIn && <button onClick={() => { setUser(null); setLoggedIn(false); }}>Logout</button>}</p>
                        {taskForm()}
                        <div>
                            <h2>Tasks</h2>
                            {sortedTasks
                                .filter(task => task.status !== 'Completed')
                                .map(task => (
                                    <div key={task.id}>
                                        <b>Task: {task.name}</b><br />
                                        Description: {task.description}<br />
                                        Deadline: {task.deadline ? formatDate(task.deadline) : 'No deadline'}<br />
                                        Status: <span className={task.status === 'Overdue' ? 'overdue-status' : ''}>{task.status === 'In Progress' ? task.status : task.status}</span><br/>
                                        Assigned to: {task.assignedTo}<br />
                                        Created By: {task.user}<br />
                                        <div>
                                            <TaskOptions
                                                task={{ 
                                                    ...task, 
                                                    id: task.id, 
                                                    user: task.user ? { username: task.user.username, name: task.user.name, id: task.user.id} : null }}
                                                deleteTask={deleteTask}
                                                modifyTask={modifyTask}
                                                acceptTask={acceptTask}
                                                completeTask={completeTask}
                                                currentUser={user}
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div>
                            <button className="history-button" onClick={toggleHistory}>{buttonText}</button><br />
                            {showHistory && (
                                <div>
                                    {sortedTasks
                                        .filter(task => task.status === 'Completed')
                                        .map(task => (
                                            <div key={task.id}>
                                                <b>Task: {task.name}</b><br />
                                                Description: {task.description}<br />
                                                Deadline: {task.deadline ? formatDate(task.deadline) : 'No deadline'}<br />
                                                Status: {task.status}<br/>
                                                Created By: {task.user}<br/>
                                                <div>
                                                    <TaskOptions
                                                        task={{ ...task, id: task.id }}
                                                        deleteTask={deleteTask}
                                                        modifyTask={modifyTask}
                                                        acceptTask={acceptTask}
                                                        completeTask={completeTask}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </>
        )
    }
    
    export default Add