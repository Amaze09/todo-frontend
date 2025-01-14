// src/pages/index.tsx
import { GetServerSideProps } from 'next'
import { useSession, signOut } from 'next-auth/react'
import { getSession } from 'next-auth/react' // <-- Add this import
import { useState } from 'react'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { Task } from '../types/task'
import styles from '../styles/Home.module.css'

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const { data: session } = useSession()

  const addTask = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask])
  }

  const editTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    )
    setEditingTask(null) // Clear editing task after update
  }

  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' }) // Redirect to home after logging out
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Todo App</h1>
      
      {session ? (
        <div className={styles.sessionInfo}>
          <p className={styles.welcome}>Welcome, {session.user?.name}!</p>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <p className={styles.notLoggedIn}>You are not logged in.</p>
      )}
      
      <TaskForm task={editingTask!} onSubmit={editingTask ? editTask : addTask} />
      <TaskList tasks={tasks} onEdit={setEditingTask} onDelete={deleteTask} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context
  const session = await getSession({ req })

  // Redirect to login page if the user is not logged in
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
