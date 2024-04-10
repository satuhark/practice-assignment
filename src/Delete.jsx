import { useState } from 'react'
import PropTypes from 'prop-types'

const Delete = ({id}) => {
    const [tasks, setTasks] = useState([])

    const deleteTask = (taskId) => {
        console.log("Before deletion:", tasks)
        setTasks(tasks.filter(task => task.id !== taskId))
        console.log("After deletion:", tasks)
    }

    const confirmDeleteTask = () => {
        const shouldDelete = window.confirm(`Delete task ${id}?`)
        if (shouldDelete) {
          deleteTask(id)
        }
      }

      return (
        <button onClick={confirmDeleteTask}>Delete task</button>
      )
}

Delete.propTypes = {
    id: PropTypes.number.isRequired
}

export default Delete