import { Task } from '../types/task'

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const TaskList = ({ tasks, onEdit, onDelete }: TaskListProps) => {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-item">
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
        </li>
      ))}
    </ul>
  )
}

export default TaskList
