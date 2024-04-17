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
    
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(baseUrl)
                console.log('promise fulfilled')
                setTasks(response.data)
            } catch (error) {
                console.error('Error fetching tasks:', error)
            }
        }
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
                        const updatedTask = { ...task, status: 'Overdue' };
                        await axios.put(`${baseUrl}/${task.id}`, updatedTask);
                        return updatedTask;
                    } else {
                    return task
                }
                }))
                setTasks(updatedTasks)
            } catch (error) {
                console.error('Error updating task statuses:', error)
            }
        }

        checkForOverdueTasks()
    }, [])

    const areDatesEqual = (date1, date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };
    

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
        }
        axios
        .post(baseUrl, newTask)
        .then(response => {
            console.log(response)
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
            <button className="button" onClick={addTask}>Add task</button>
            </div>
            
            <div>
            <h2>Tasks</h2>
                {sortedTasks
                .filter(task => task.status !== 'Completed')
                .map(task => (
                    <div key={task.id}>
                        <b>Task: {task.name}</b><br/>
                        Description: {task.description}<br/>
                        Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}<br/>
                        Status: {task.status}
                        <div><TaskOptions
                        task={{ ...task, id: task.id }}
                        deleteTask={deleteTask}
                        modifyTask={modifyTask}
                        acceptTask={acceptTask}
                        completeTask={completeTask}/>
                        </div>
                    </div>
                ))}
            </div>
            <div>
            <h2>History</h2>
            {sortedTasks
                .filter(task => task.status === 'Completed')
                .map(task => (
                    <div key={task.id}>
                        <b>Task: {task.name}</b><br/>
                        Description: {task.description}<br/>
                        Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}<br/>
                        Status: {task.status}
                        <div><TaskOptions
                            task={{ ...task, id: task.id }}
                            deleteTask={deleteTask}
                            modifyTask={modifyTask}
                            acceptTask={acceptTask}
                            completeTask={completeTask}
                        /></div>
                    </div>
                ))
            }
        </div>


        </div>
    )
}

export default Add