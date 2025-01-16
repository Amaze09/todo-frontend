import { GetServerSideProps } from 'next'
import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { getSession } from 'next-auth/react'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { Task } from '../types/task'
import styles from '../styles/Home.module.css'

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const { data: session } = useSession()

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/tasksByUser/${session?.user?.name}`, {
        method: 'GET',
      })
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  const addTask = async (newTask: Task) => {
    try {
      const response = await fetch('http://localhost:8080/api/createTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newTask, username: session?.user?.name }),
      })
      const createdTask = await response.json()
      setTasks((prevTasks) => [...prevTasks, createdTask])
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }

  const editTask = async (updatedTask: Task) => {
    try {
      const response = await fetch('http://localhost:8080/api/updateTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      })
      const updated = await response.json()
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updated.id ? updated : task))
      )
      setEditingTask(null) // Clear editing task after update
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await fetch(`http://localhost:8080/api/deleteTask/${taskId}`, {
        method: 'DELETE',
      })
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const completeTask = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/setComplete/${taskId}`, {
        method: 'POST',
      })
      const completedTask = await response.json()
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? completedTask : task))
      )
    } catch (error) {
      console.error('Failed to mark task as completed:', error)
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' }) // Redirect to the login page after logout
  }

  const calculateCompletionPercentage = () => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.completed).length
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  }

  useEffect(() => {
    if (session) {
      fetchTasks()
    }
  }, [session])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ToDo-Ai</h1>

      {session ? (
        <div className={styles.sessionInfo}>
          <p className={styles.welcome}>
            Welcome, {session.user?.name}!{' '}
            <span className={styles.stats}>
              You have completed {calculateCompletionPercentage()}% of your tasks.
            </span>
          </p>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <p className={styles.notLoggedIn}>You are not logged in.</p>
      )}

      <TaskForm task={editingTask!} onSubmit={editingTask ? editTask : addTask} />
      <TaskList
        tasks={tasks}
        onEdit={setEditingTask}
        onDelete={deleteTask}
        onComplete={completeTask} // Pass the completeTask method
      />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context
  const session = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

export default Home
