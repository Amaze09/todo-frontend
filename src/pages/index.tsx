import { GetServerSideProps } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { Task } from '../types/task';
import styles from '../styles/Home.module.css';
import * as dotenv from 'dotenv';
dotenv.config();

const api_url = process.env.API_URL || 'http://localhost:8080';

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const fetchTasks = async () => {
    setLoading(true); 
    try {
      const response = await fetch(api_url + `/api/tasksByUser/${session?.user?.name}`, {
        method: 'GET',
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false); 
    }
  };

  const addTask = async (newTask: Task) => {
    setLoading(true);
    try {
      const response = await fetch(api_url + '/api/createTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newTask, username: session?.user?.name }),
      });
      const createdTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, createdTask]);
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false);
    }
  };

  const editTask = async (updatedTask: Task) => {
    setLoading(true);
    try {
      const response = await fetch(api_url + '/api/updateTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      const updated = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updated.id ? updated : task))
      );
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setLoading(true);
    try {
      await fetch(api_url + `/api/deleteTask/${taskId}`, {
        method: 'DELETE',
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      if (editingTask?.id === taskId) {
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: string) => {
    setLoading(true);
    try {
      const response = await fetch(api_url + `/api/setComplete/${taskId}`, {
        method: 'POST',
      });
      const completedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? completedTask : task))
      );
    } catch (error) {
      console.error('Failed to mark task as completed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  const redirectToSuggestions = () => {
    router.push('/ai-suggestions');
  };

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);

  return (
    <div className={styles.container}>
      {loading && <div className={styles.loader}>Loading...</div>} {/* Loader */}

      <h1 className={styles.title}>Todo App</h1>

      {session ? (
        <div className={styles.sessionInfo}>
          <p className={styles.welcome}>
            Welcome, {session.user?.name}!
          </p>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <p className={styles.notLoggedIn}>You are not logged in.</p>
      )}

      <button className={styles.magicButton} onClick={redirectToSuggestions}>
        ✨ Magic AI Suggestions
      </button>

      <TaskForm task={editingTask!} onSubmit={editingTask ? editTask : addTask} />

      <TaskList
        tasks={tasks}
        onEdit={setEditingTask}
        onDelete={deleteTask}
        onComplete={completeTask}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default Home;
