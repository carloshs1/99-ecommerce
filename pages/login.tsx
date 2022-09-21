import Link from 'next/link'
import { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import Layout from '../components/Layout'
import { LoginFormValues } from '../utils/types'
import { getError } from '../utils/error'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const LoginScreen = () => {
 const { data: session } = useSession()

 const router = useRouter()
 const { redirect } = router.query

 useEffect(() => {
  if (session?.user) {
   router.push((redirect as string) || '/')
  }
 }, [router, session, redirect])
 const {
  handleSubmit,
  register,
  formState: { errors },
 } = useForm<LoginFormValues>()
 const submitHandler: SubmitHandler<FieldValues> = async ({
  email,
  password,
 }) => {
  try {
   const result = await signIn('credentials', {
    redirect: false,
    email,
    password,
   })
   if (result!.error) {
    toast.error(result!.error)
   }
  } catch (err) {
   toast.error(getError(err))
  }
 }
 return (
  <Layout title="Login">
   <form
    className="mx-auto max-w-screen-md"
    onSubmit={handleSubmit(submitHandler)}
   >
    <h1 className="mb-4 text-xl">Login</h1>
    <div className="mb-4">
     <label htmlFor="email">Email</label>
     <input
      type="email"
      {...register('email', {
       required: 'Please enter email',
       pattern: {
        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
        message: 'Please enter valid email',
       },
      })}
      className="w-full"
      id="email"
      autoFocus
     ></input>
     {errors.email && (
      <div className="text-red-500">{errors.email.message}</div>
     )}
    </div>
    <div className="mb-4">
     <label htmlFor="password">Password</label>
     <input
      type="password"
      {...register('password', {
       required: 'Please enter password',
       minLength: {
        value: 6,
        message: 'password needs to be longer than 5 characters',
       },
      })}
      className="w-full"
      id="password"
      autoFocus
     ></input>
     {errors.password && (
      <div className="text-red-500 ">{errors.password.message}</div>
     )}
    </div>
    <div className="mb-4 ">
     <button className="primary-button">Login</button>
    </div>
    <div className="mb-4 ">
     Don&apos;t have an account? &nbsp;
     <Link href={`/register?redirect=${redirect || '/'}`}>Register</Link>
    </div>
   </form>
  </Layout>
 )
}

export default LoginScreen
