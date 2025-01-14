// src/pages/login.tsx
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import styles from '../styles/Login.module.css' // Import the styles

interface FormData {
  username: string
  password: string
}

const LoginPage = () => {
  const { register, handleSubmit } = useForm<FormData>()
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    const res = await signIn('credentials', {
      redirect: false,
      username: data.username,
      password: data.password,
    })

    if (res?.error) {
      alert('Login failed')
    } else {
      router.push('/') // Redirect to the home page
    }
  }

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className={styles.inputField}
          {...register('username')}
          placeholder="Username"
        />
        <input
          className={styles.inputField}
          type="password"
          {...register('password')}
          placeholder="Password"
        />
        <button className={styles.button} type="submit">
          Log In
        </button>
      </form>
    </div>
  )
}

export default LoginPage
