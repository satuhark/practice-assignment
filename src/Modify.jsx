import { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/tasks'

const Modify = ({ task, onModify }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [modifiedTask, setModifiedTask] = useState(task)

    const toggleEditing = () => {
        setIsEditing(!isEditing)
        setModifiedTask(task)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setModifiedTask({ ...modifiedTask, [name]: value })
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
                    <button className="modify-button" onClick={saveModifiedTask}>Save</button>
                </div>
            ) : (
                <button className="modify-button" onClick={toggleEditing}>Modify task</button>
            )}
        </span>
    )
}

Modify.propTypes = {
    task: PropTypes.object.isRequired,
    onModify: PropTypes.func.isRequired,
}

export default Modify
