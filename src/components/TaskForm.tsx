import { useState, useEffect } from 'react';
import React from 'react';
import { Task } from '../types/task';

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Task) => void;
}

const TaskForm = ({ task, onSubmit }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(5);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 5);
      if (task.deadline) {
        const deadlineDate = new Date(task.deadline);
        setDate(deadlineDate.toISOString().split('T')[0]);
        setTime(
          deadlineDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        );
      }
    } else {
      setTitle('');
      setDescription('');
      setPriority(5);
      setDate('');
      setTime('');
      setError(null);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Task Name is required.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    if (!priority || priority < 1 || priority > 10) {
      setError('Priority must be a number between 1 and 10.');
      return;
    }
    if (!date || !time) {
      setError('Deadline (date and time) is required.');
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const localDeadline = new Date(date);
    localDeadline.setHours(hours, minutes);

    onSubmit({
      id: task?.id,
      title: title.trim(),
      description: description.trim(),
      priority,
      deadline: localDeadline.toISOString(),
      completed: task?.completed || false,
    });

    setTitle('');
    setDescription('');
    setPriority(5);
    setDate('');
    setTime('');
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      {error && <p className="form-error">{error}</p>}

      <label className="form-label">
        Title
        <input
          type="text"
          className="form-input"
          placeholder="Enter task name"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
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
            setDescription(e.target.value);
            setError(null);
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
            setPriority(Number(e.target.value));
            setError(null);
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
            setDate(e.target.value);
            setError(null);
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
            setTime(e.target.value);
            setError(null);
          }}
        />
      </label>

      <button type="submit" className="form-button">
        {task ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;
