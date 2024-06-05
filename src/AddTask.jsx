import React, { useState, useEffect } from 'react'
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
        const checkTokenExpiry = () => {
        const token = localStorage.getItem('token')
        const expiryTime = localStorage.getItem('expiryTime')
        
        if (token && expiryTime) {
            const currentTime = new Date().getTime()
            if (currentTime > parseInt(expiryTime, 10)) {
                localStorage.removeItem('token')
                localStorage.removeItem('expiryTime')
                setUser(null)
                window.location.href = '/login'
            } 
        }
    }
    
    const intervalId = setInterval(checkTokenExpiry, 60000)
    return () => clearInterval(intervalId)

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

    useEffect(() => {
        try { 
            const storedToken = localStorage.getItem("token")
            const storedUser = localStorage.getItem("user")
        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        } 
    }   catch (error) {
            console.error("Error retrieving user from localStorage:", error)
        }
      }, [])

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

    const addTask = async event => {
        event.preventDefault()
        if (!validateInput()) return
        
        const newTask = {
            name: name,
            description: description,
            deadline: deadline,
            status: "To Do",
            createdby: user.name        
        }

        const token = localStorage.getItem('token')
        if (!token) {
            console.error('Token not found')
            return
        }

        try {
            const response = await axios.post(baseUrl, newTask, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            
            setTasks(prevTasks => [...prevTasks, response.data])
            await fetchTasks()
            clearFields()
          } catch (error) {
            console.error('Error adding task:', error)
          }
        }
    
    const deleteTask = async (taskId) => {
        try {
          await axios.delete(`${baseUrl}/${taskId}`)
          setTasks(tasks.filter(task => task.id !== taskId))
        } catch (error) {
          console.error('Error deleting task:', error)
        }
      }
    
    const modifyTask = (modifiedTask) => {
        const updatedTasks = tasks.map(task =>
            task.id === modifiedTask.id ? modifiedTask : task
        )
        setTasks(updatedTasks)
    }

    const acceptTask = async (taskId) => {
        const acceptedTask = tasks.find(task => task.id === taskId)
        if (acceptedTask) {
            acceptedTask.status = "In Progress"
            acceptedTask.assignedTo = user.name
            try {
                const response = await axios.put(`${baseUrl}/${taskId}`, acceptedTask)
                setTasks(tasks.map(task => (task.id === taskId ? acceptedTask : task)))
                console.log('Task status updated successfully:', response.data)
              } catch (error) {
                console.error('Error updating task status:', error)
              }
            }
          }
    
    const completeTask = async (taskId) => {
        const completedTask = tasks.find(task => task.id === taskId)
        if (completedTask) {
            completedTask.status = "Completed"
            try {
                const response = await axios.put(`${baseUrl}/${taskId}`, completedTask)
                setTasks(tasks.map(task => (task.id === taskId ? completedTask : task)))
                console.log('Task status updated successfully:', response.data)
              } catch (error) {
                console.error('Error updating task status:', error)
              }
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

        const handleLogout = () => {
            setUser(null)
            setLoggedIn(false)
            localStorage.clear()
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
                        <p>{user.name} logged in {<button onClick={handleLogout}>Logout</button>}</p>
                        {taskForm()}
                        <div>
                            <h2>Tasks</h2>
                            {sortedTasks
                                .filter(task => task.status !== 'Completed')
                                .map(task => (
                                    <div key={task.id}>
                                        <b>Task: {task.name}</b><br />
                                        Description: {task.description}<br />
                                        Deadline: {formatDate(task.deadline)}<br />
                                        Status: <span className={task.status === 'Overdue' ? 'overdue-status' : ''}>{task.status}</span><br/>
                                        Assigned to: {task.assignedTo ? task.assignedTo : '' }<br />
                                        Created By: {task.createdby}<br />
                                        <div>
                                            <TaskOptions
                                                tasks={tasks}
                                                setTasks={setTasks}
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