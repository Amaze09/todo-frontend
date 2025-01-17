// src/pages/signup.tsx
import { useForm } from 'react-hook-form'
import React from 'react';
import { useRouter } from 'next/router'
import styles from '../styles/Signup.module.css'

interface FormData {
  username: string
  email: string
  password: string
}

const SignupPage = () => {
  const { register, handleSubmit } = useForm<FormData>()
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("http://localhost:8080/api/signup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();  

      if (!response.ok) {
        console.error('Signup failed:', responseData);
        alert('Signup failed. Please try again.');
        return;
      }

      alert('Signup successful! You can now log in.');
      router.push('/login');
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Failed to connect to the server. Please try again.');
    }
  };

  const goToLogin = () => {
    router.push('/login') 
  }

  return (
    <div className={styles.container}>
      <h1>Sign Up</h1>
      <form className={styles.signUpForm} onSubmit={handleSubmit(onSubmit)}>
        <input
          className={styles.inputField}
          {...register('username')}
          placeholder="Username"
        />
        <input
          className={styles.inputField}
          type="email"
          {...register('email')}
          placeholder="Email"
        />
        <input
          className={styles.inputField}
          type="password"
          {...register('password')}
          placeholder="Password"
        />
        <button className={styles.button} type="submit">
          Sign Up
        </button>
      </form>
      <button className={styles.backButton} onClick={goToLogin}>
        Back to Login
      </button>
    </div>
  )
}

export default SignupPage
