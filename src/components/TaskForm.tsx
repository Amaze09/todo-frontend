import { useState, useEffect } from 'react'
import React from 'react';
import { Task } from '../types/task'

interface TaskFormProps {
  task?: Task
  onSubmit: (task: Task) => void
}

const TaskForm = ({ task, onSubmit }: TaskFormProps) => {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [priority, setPriority] = useState(task?.priority || 5)
  const [date, setDate] = useState(task?.deadline ? task.deadline.split('T')[0] : '')
  const [time, setTime] = useState(task?.deadline ? task.deadline.split('T')[1]?.slice(0, 5) : '')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setPriority(task.priority)
      if (task.deadline) {
        setDate(task.deadline.split('T')[0])
        setTime(task.deadline.split('T')[1]?.slice(0, 5))
      }
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation for required fields
    if (!title.trim()) {
      setError('Task Name is required.')
      return
    }
    if (!description.trim()) {
      setError('Description is required.')
      return
    }
    if (!priority || priority < 1 || priority > 10) {
      setError('Priority must be a number between 1 and 10.')
      return
    }
    if (!date || !time) {
      setError('Deadline (date and time) is required.')
      return
    }

    // Combine date and time into ISO string
    const deadline = new Date(`${date}T${time}`).toISOString()

    // Submit the form if all fields are valid
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      deadline,
      completed: false,
    })

    // Reset the form
    setTitle('')
    setDescription('')
    setPriority(5)
    setDate('')
    setTime('')
    setError(null)
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      {error && <p className="form-error">{error}</p>}

      <label className="form-label">
        Task Name
        <input
          type="text"
          className="form-input"
          placeholder="Enter task name"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setError(null) // Clear error when the user types
          }}
        />
      </label>

      <label className="form-label">
        Description
        <textarea
          className="form-input"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            setError(null) // Clear error when the user types
          }}
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
          onChange={(e) => {
            setPriority(Number(e.target.value))
            setError(null) // Clear error when the user types
          }}
        />
      </label>

      <label className="form-label">
        Deadline (Date)
        <input
          type="date"
          className="form-input"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            setError(null) // Clear error when the user selects a date
          }}
        />
      </label>

      <label className="form-label">
        Deadline (Time)
        <input
          type="time"
          className="form-input"
          value={time}
          onChange={(e) => {
            setTime(e.target.value)
            setError(null) // Clear error when the user selects a time
          }}
        />
      </label>

      <button type="submit" className="form-button">
        {task ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  )
}

export default TaskForm
