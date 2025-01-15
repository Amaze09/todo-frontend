import { Task } from '../types/task'
import React from 'react'

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void // New handler for marking tasks as complete
}

const TaskList = ({ tasks, onEdit, onDelete, onComplete }: TaskListProps) => {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task?.id} className="task-item">
          <span className="task-title">{task.title}</span>
          <button
            className="edit-button"
            onClick={() => onEdit(task)}
          >
            Edit
          </button>
          <button
            className="delete-button"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
          <button
            className="complete-button"
            onClick={() => onComplete(task.id)}
          >
            Complete
          </button>
        </li>
      ))}
    </ul>
  )
}

export default TaskList
