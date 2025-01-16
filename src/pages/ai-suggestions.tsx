import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import styles from '../styles/AISuggestions.module.css';
// taskid to send to backend
const AISuggestions = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { taskId, taskTitle, taskDescription } = router.query; // Retrieve task details from query params

  const [steps, setSteps] = useState<string[]>([]); // Store task steps
  const [loading, setLoading] = useState<boolean>(false);

  // Function to get task details from AI (simulate AI response)
  const getAIResponse = async () => {
    if (!taskTitle || !taskDescription) return;

    setLoading(true);

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle, taskDescription }),
      });
      const data = await response.json();

      // Assuming the AI returns only steps now
      setSteps(data.steps || []);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskTitle && taskDescription) {
      getAIResponse();
    }
  }, [taskTitle, taskDescription]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>AI Task Suggestions</h1>
      {session ? (
        <div className={styles.sessionInfo}>
          <p className={styles.welcome}>Hello, {session.user?.name}!</p>
        </div>
      ) : (
        <p className={styles.notLoggedIn}>You are not logged in.</p>
      )}

      <div className={styles.taskDetails}>
        <h2>Task: {taskTitle}</h2>
        <p>{taskDescription}</p>
      </div>

      {loading ? (
        <p>Loading AI response...</p>
      ) : (
        <div className={styles.aiResponse}>
          <h4>Task Steps:</h4>
          <ul>
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Back button */}
      <button 
        className={styles.backButton} 
        onClick={() => router.push('/')} // Navigate to the index page
      >
        Back to Tasks
      </button>
    </div>
  );
};

export default AISuggestions;
