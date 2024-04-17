import { useState } from 'react'
import PropTypes from 'prop-types'
import Delete from './Delete'
import Modify from './Modify'
import './index.css'


const TaskOptions = ({ task, deleteTask, modifyTask, acceptTask, completeTask }) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    return (
        <span className="button-container">
                <button className="options-button" onClick={toggleDropdown}>Options</button>
                {isOpen && (
                    <div className="options-dropdown">
                        <Delete id={task.id} name={task.name} onDelete={deleteTask} />
                        <Modify task={task} onModify={modifyTask} />
                        {task.status === "To Do" || task.status === "Overdue" && <button className="accept-button" onClick={() => acceptTask(task.id.toString())}>Accept Task</button>}
                        {task.status === "In Progress" && <button className="completed-button" onClick={() => completeTask(task.id.toString())}>Task Completed</button>}
                    </div>
                )}
                </span>
        )
}

TaskOptions.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        status: PropTypes.oneOf(["To Do", "In Progress", "Completed", "Cancelled", "Overdue", "Due today"]).isRequired
    }),
    deleteTask: PropTypes.func.isRequired,
    modifyTask: PropTypes.func.isRequired,
    acceptTask: PropTypes.func.isRequired,
    completeTask: PropTypes.func.isRequired
}

export default TaskOptions