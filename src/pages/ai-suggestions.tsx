import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import styles from '../styles/AISuggestions.module.css';

const AISuggestions = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [suggestion, setSuggestion] = useState<string | null>(null); 
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAISuggestion = async () => {
    if (!session?.user?.name) {
      console.error("User is not logged in or session is unavailable.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/getAISuggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: session.user.name }),
      });
      const data = await response.json();
      setSuggestion(data.suggestion.response || 'No suggestion available.');
    } catch (error) {
      console.error('Error fetching AI suggestion:', error);
      setSuggestion('Failed to fetch suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.name) {
      fetchAISuggestion();
    }
  }, [session?.user?.name]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>AI Task Prioritization</h1>
      {session ? (
        <div className={styles.sessionInfo}>
          <p className={styles.welcome}>Hello, {session.user?.name}!</p>
        </div>
      ) : (
        <p className={styles.notLoggedIn}>You are not logged in.</p>
      )}

      {loading ? (
        <p className={styles.loading}>Fetching prioritization suggestion...</p>
      ) : (
        <div className={styles.suggestionBox}>
          <h3>Prioritization Suggestion:</h3>
          <p>{suggestion}</p>
        </div>
      )}

      <button
        className={styles.backButton}
        onClick={() => router.push('/')} 
      >
        Back to Tasks
      </button>
    </div>
  );
};

export default AISuggestions;
