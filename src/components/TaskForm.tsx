import { useState, useEffect } from 'react'
import { Task } from '../types/task'

interface TaskFormProps {
  task?: Task
  onSubmit: (task: Task) => void
}

const TaskForm = ({ task, onSubmit }: TaskFormProps) => {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [priority, setPriority] = useState(task?.priority || 5)
  const [deadline, setDeadline] = useState(task?.deadline || '')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setPriority(task.priority)
      setDeadline(task.deadline)
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && description.trim()) {
      onSubmit({ 
        id: task?.id || Date.now().toString(), 
        title, 
        description, 
        priority, 
        deadline, 
        completed: false 
      })
      setTitle('')
      setDescription('')
      setPriority(5)
      setDeadline('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <label className="form-label">
        Task Name
        <input
          type="text"
          className="form-input"
          placeholder="Enter task name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className="form-label">
        Description
        <textarea
          className="form-input"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label className="form-label">
        Priority (1-10)
        <input
          type="number"
          className="form-input"
          min="1"
          max="10"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
        />
      </label>

      <label className="form-label">
        Deadline
        <input
          type="date"
          className="form-input"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </label>

      <button type="submit" className="form-button">
        {task ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  )
}

export default TaskForm
