import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import './index.css'

const baseUrl = 'http://localhost:3001/api/tasks'

const Delete = ({name, id, onDelete }) => {
    const confirmDeleteTask = () => {
      if (!id) {
        console.error('No ID provided for deletion.')
        return
    }
        const shouldDelete = window.confirm(`Delete task ${name}?`)
        if (shouldDelete) {
          onDelete(id)
          axios
          .delete(`${baseUrl}/${id}`)
          .then(response => {
            console.log('Task deleted successfully:', response.data)
        })
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

