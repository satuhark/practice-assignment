import { useState } from 'react'
import PropTypes from 'prop-types'
import Delete from './Delete'
import Modify from './Modify'
import './index.css'


const TaskOptions = ({ task, deleteTask, modifyTask, acceptTask, completeTask, currentUser }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [buttonText, setButtonText] = useState('Options')
    
    const toggleDropdown = () => {
        setIsOpen(!isOpen)
        setShowOptions(!showOptions)
        setButtonText(showOptions ? 'Options' : 'Hide Options')
    }

    return (
        <span className="button-container">
                <button className="options-button" onClick={toggleDropdown}>{buttonText}</button>
                {isOpen && (
                    <div className="options-dropdown">
                        <Delete id={task.id} name={task.name} onDelete={deleteTask} />
                        <Modify task={task} onModify={modifyTask} user={currentUser} />
                        {(task.status === "To Do" || task.status === "Overdue" || task.status === "Due today") && !task.assignedTo && (<button className="accept-button" onClick={() => acceptTask(task.id.toString())}>Accept Task</button>)}
                        {(task.assignedTo && task.user && task.user.name === currentUser) && (<button className="completed-button" onClick={() => completeTask(task.id.toString())}>Task Completed</button>)}
                    </div>
                )}
                </span>
        )
}

TaskOptions.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        status: PropTypes.oneOf(["To Do", "In Progress", "Completed", "Cancelled", "Overdue", "Due today"]).isRequired,
        assignedTo: PropTypes.string,
        user: PropTypes.shape({
            username: PropTypes.string,
            name: PropTypes.string,
            id: PropTypes.string,
        }),
    }),
    deleteTask: PropTypes.func.isRequired,
    modifyTask: PropTypes.func.isRequired,
    acceptTask: PropTypes.func.isRequired,
    completeTask: PropTypes.func.isRequired,
    currentUser: PropTypes.object
}

export default TaskOptions