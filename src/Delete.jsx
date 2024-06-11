import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import './index.css'

const baseUrl = 'https://practice-assignment-1.onrender.com/api/tasks'

const Delete = ({name, id, tasks, setTasks }) => {
    const confirmDeleteTask = async () => {
      if (!id) {
        console.error('No ID provided for deletion.')
        return
    }
        const shouldDelete = window.confirm(`Delete task ${name}?`)
        if (shouldDelete) {
          await axios
          .delete(`${baseUrl}/${id}`)
          .then(response => {
            console.log('Task deleted successfully:', response.data)
        })
        const updatedTasks = tasks.filter(task => task.id !== id)
        setTasks(updatedTasks)
      }
    }

      return (
        <button className="delete-button" onClick={confirmDeleteTask}>Delete task</button>
      )
}

Delete.propTypes = {
    id: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
}

export default Delete

