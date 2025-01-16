import { Task } from '../types/task'
import React from 'react'
import { useRouter } from 'next/router'

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void
}

const TaskList = ({ tasks, onEdit, onDelete, onComplete }: TaskListProps) => {
  const router = useRouter()

  const handleMagicClick = (task: Task) => {
    // Redirect to AI Suggestion page with task details as query parameters
    router.push({
      pathname: '/ai-suggestions',
      query: { taskId: task.id, taskTitle: task.title, taskDescription: task.description }
    })
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <span className="task-title">{task.title}</span>
          
          {!task.completed && (
            <>
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
              {/* Magic Wand Button */}
              <button
                className="magic-button"
                onClick={() => handleMagicClick(task)}
              >
                ✨
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

export default TaskList
