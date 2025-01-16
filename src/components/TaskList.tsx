import { Task } from '../types/task'
import React from 'react'

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void
}

const TaskList = ({ tasks, onEdit, onDelete, onComplete }: TaskListProps) => {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task?.id} className="task-item">
          <div className="task-content">
            <span className={`task-title ${task.completed ? 'completed' : ''}`}>
              {task.title}
            </span>
            {task.completed && task.description && (
              <p className="task-description">{task.description}</p>
            )}
          </div>
          {!task.completed && (
            <div className="task-buttons">
              <button className="edit-button" onClick={() => onEdit(task)}>
                Edit
              </button>
              <button className="delete-button" onClick={() => onDelete(task.id)}>
                Delete
              </button>
              <button className="complete-button" onClick={() => onComplete(task.id)}>
                Complete
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export default TaskList
