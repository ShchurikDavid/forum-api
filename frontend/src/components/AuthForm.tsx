import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useForm } from 'react-hook-form'
import { useLoginUserMutation, useRegisterUserMutation, type AuthFormData } from '../api/baseApi'

export function RegisterForm() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<AuthFormData>()
  const [registerUser] = useRegisterUserMutation()

  async function submit(data: AuthFormData) {
    const result = await registerUser(data)
    if (result.data) {
      alert('Реєстрація успішна.')
    } else {
      alert('Не вдалося зареєструватися.')
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(submit)}>
      <h2>Реєстрація</h2>
      <label>
        Електронна пошта
        <input type="email" {...register('email')} />
      </label>
      <label>
        Пароль
        <input type="password" {...register('password')} />
      </label>
      <button type="submit" disabled={isSubmitting}>Зареєструватися</button>
    </form>
  )
}

interface LoginData {
  email: string
  password: string
}

export function LoginForm() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginData>()
  const [login] = useLoginUserMutation()

  async function onSubmit(data: LoginData) {
    try {
      await login(data).unwrap()
    } catch (error) {
      const apiError = error as FetchBaseQueryError
      let message = ''
      if (apiError.status === 401) {
        message = 'неправильний email або пароль'
      }
      setError('root', { message })
    }
  }

  return (
    <form className="auth-form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <h2>Вхід</h2>
      <label>
        Електронна пошта
        <input type="email" placeholder="Введіть електронну пошту" {...register('email', {
          required: 'введіть email',
          maxLength: { value: 25, message: 'email занадто довгий' },
          validate: (value) => {
            if (!value.includes('@') || !value.includes('.')) {
              return 'Некоректний email'
            }
          },
        })} />
      </label>
      {errors.email && <p>{errors.email.message}</p>}
      <label>
        Пароль
        <input type="password" placeholder="Введіть пароль" {...register('password')} />
      </label>
      <button type="submit">Увійти</button>
      {errors.root && <p>{errors.root.message}</p>}
    </form>
  )
}
