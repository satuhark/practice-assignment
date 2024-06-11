import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

const baseUrl = 'https://practice-assignment-1.onrender.com/api/tasks'

const Modify = ({ task, onModify, user, assignedTo }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [modifiedTask, setModifiedTask] = useState(task)
    const [showModify, setShowModify] = useState(false)
    const [buttonText, setButtonText] = useState('Modify')
    
    
    const toggleEditing = () => {
        setIsEditing(!isEditing)
        setModifiedTask(task)
        setShowModify(!showModify)
        setButtonText(showModify ? 'Modify' : 'Cancel')
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setModifiedTask({ ...modifiedTask, [name]: value })
    }

    const handleAssignToMe = () => {
        setModifiedTask({ ...modifiedTask, assignedTo: user.name })
    }

    const saveModifiedTask = () => {
        axios
        .put(`${baseUrl}/${task.id}`, modifiedTask)
        .then(response => {
            console.log('Task updated successfully:', response.data)
            onModify(response.data)
            toggleEditing()
        })
        .catch(error => {
            console.error('Error updating task:', error)
            })
    }

    return (
        <span>
            {isEditing ? (
                <div className ="input-field">
                    <input
                        type="text"
                        name="name"
                        value={modifiedTask.name}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="description"
                        value={modifiedTask.description}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="deadline"
                        value={modifiedTask.deadline}
                        onChange={handleInputChange}
                    />
                    <select
                        name="status"
                        value={modifiedTask.status}
                        onChange={handleInputChange}
                    >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    {assignedTo != user.name && <button className="modify-button" onClick={handleAssignToMe}>Assign to me</button>}
                    <button className="modify-button" onClick={saveModifiedTask}>Save</button>
                    <button className="modify-button" onClick={toggleEditing}>{buttonText}</button>
                </div>
            ) : (
                <button className="modify-button" onClick={toggleEditing}>{buttonText}</button>
            )}
        </span>
    )
}

Modify.propTypes = {
    task: PropTypes.object.isRequired,
    onModify: PropTypes.func.isRequired,
    user: PropTypes.object
}

export default Modify
