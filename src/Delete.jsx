import PropTypes from 'prop-types'
import axios from 'axios'
import './index.css'

const Delete = ({name, _id, onDelete }) => {
    const confirmDeleteTask = () => {
        const shouldDelete = window.confirm(`Delete task ${name}?`)
        if (shouldDelete) {
          onDelete(_id.toString())
          axios
          .delete(`http://localhost:3001/tasks/${_id}`)
          .then(response => {
            console.log('Task deleted successfully:', response.data)
        })
        .catch(error => {
            console.error('Error deleting task:', error)
        })
          }
      }

      return (
        <button className="delete-button" onClick={confirmDeleteTask}>Delete task</button>
      )
}

Delete.propTypes = {
    _id: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
}

export default Delete

