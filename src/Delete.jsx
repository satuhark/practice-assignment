import PropTypes from 'prop-types'
import axios from 'axios'
import './index.css'

const Delete = ({id, onDelete }) => {
    const confirmDeleteTask = () => {
        const shouldDelete = window.confirm(`Delete task ${id}?`)
        if (shouldDelete) {
          onDelete(id)
          axios
          .delete(`http://localhost:3001/tasks/${id}`)
          }
      }

      return (
        <button className="delete-button" onClick={confirmDeleteTask}>Delete task</button>
      )
}

Delete.propTypes = {
    id: PropTypes.number.isRequired,
    onDelete: PropTypes.func.isRequired
}

export default Delete

