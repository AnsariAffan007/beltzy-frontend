import React, { useEffect, useState } from 'react'
import { FaCircleUser, FaKey, FaLock } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import Input from './Input';
import axios from 'axios';
import { useIsAuthenticated } from 'react-auth-kit';
import { useForm } from 'react-hook-form';
import useAuthenticator from './hooks/useAuthenticator';
import { toast } from 'react-toastify';

const Login = (props) => {

  const navigate = useNavigate();

  const { register, handleSubmit, setFocus, setError, formState: { errors } } = useForm();

  const isAuthenticated = useIsAuthenticated()();
  useEffect(() => {
    if (isAuthenticated) navigate('/');
    setFocus('username');
  }, [isAuthenticated, navigate, setFocus])

  const signInUser = useAuthenticator();

  const [loginBtnActive, setLoginBtnActive] = useState(true);

  // Submit credentials and login
  function onSubmit(data) {
    if (!loginBtnActive) {
      toast('Please wait while your credentials are being validated', { toastId: 'no dups' });
      return;
    }
    setLoginBtnActive(false);
    axios({
      method: "POST",
      url: "/buyer-login",
      withCredentials: true,
      data: data
    })
      .then((res) => {
        let buyerData = res.data.buyer;
        buyerData.role = 'buyer';
        signInUser({
          token: res.data.token,
          expiresIn: 120,
          tokenType: "Bearer",
          authState: buyerData
        })
        props.setUserState(true, buyerData, 'buyer')
        toast('Sign in Successful !');
        setLoginBtnActive(true);
        navigate('/dashboard');
      })
      .catch((err) => {
        setError(err.response.data.type, { type: err.response.data.type, message: err.response.data.message }, { shouldFocus: true });
        toast(err.response.data.message, { toastId: 'no-dups' });
        setLoginBtnActive(true);
      })
  }

  // Catch errors while validation
  function onError(err) {
    let errorMessage = (err[Object.keys(err)[0]]).message
    toast(errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1), { toastId: 'no-dups' });
  }

  return (
    <section id='login' className='px-5 md:px-10 flex justify-center'>
      <div className='my-14 bg-amber-100 rounded-lg w-full sm:w-80'>
        <h1 className='bg-amber-900 rounded-t-lg p-4 text-white text-center text-2xl'>Login</h1>
        <form onSubmit={handleSubmit(onSubmit, onError)} className='p-5'>
          <div className='mt-6 mb-4 sm:mb-8 flex'>
            <span className='mx-auto text-3xl text-amber-900'><FaLock /></span>
          </div>
          <div className='grid grid-cols-1 gap-4'>
            <Input
              placeholder="Username"
              name="username"
              icon=<FaCircleUser />
              register={register}
              message="Username is required"
              errMessage={errors.username?.message}
            />
            <Input
              icon=<FaKey />
              placeholder="Password"
              name="password"
              register={register}
              message="Password is required"
              errMessage={errors.password?.message}
              type='password'
            />
          </div>
          <div className='mt-10'>
            <button className={`${!loginBtnActive && 'button-loading'} h-10 mb-6 p-2 bg-amber-900 text-white w-full rounded-lg scale-animation`}>
              {!loginBtnActive ? '' : 'Login'}
            </button>
          </div>
          <div className='text-xs sm:text-sm text-amber-900 text-center'><Link to="/register">Don't have an account? <span className='underline'>Register</span></Link></div>
        </form>
      </div>
    </section>
  )
}

export default Login