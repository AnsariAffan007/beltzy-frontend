import React, { useEffect, useState } from 'react'
import { FaCircleUser, FaUserPlus, FaKey, FaEnvelope, FaPhone } from "react-icons/fa6";
import Input from './Input';
import axios from 'axios';
import useAuthenticator from './hooks/useAuthenticator';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useIsAuthenticated } from 'react-auth-kit';
import { toast } from 'react-toastify';

const Register = (props) => {

  const signInUser = useAuthenticator();
  const navigate = useNavigate();

  const { register, handleSubmit, setFocus, setError, formState: { errors } } = useForm({
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      password: '',
      address: ''
    },
    shouldFocusError: false
  });

  const isAuthenticated = useIsAuthenticated()();
  useEffect(() => {
    if (isAuthenticated) navigate('/');
    setFocus('username');
  }, [isAuthenticated, navigate, setFocus])

  const [submitBtnActive, setSubmitBtnActive] = useState(true);

  // Submitting user details form
  function onSubmit(data) {
    if (!submitBtnActive) {
      toast('Please wait while we register your account', {toastId: 'no dups'});
      return;
    }
    setSubmitBtnActive(false);
    axios({
      method: "POST",
      url: "/buyer-register",
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
        setSubmitBtnActive(true);
        toast("Registration Successful", {toastId: 'no dups'});
        navigate('/dashboard');
      })
      .catch((err) => {
        setError(err.response.data.type, { type: err.response.data.type, message: err.response.data.message }, { shouldFocus: true })
        toast(err.response.data.message);
        setSubmitBtnActive(true)
      })
  }

  // Catching errors on form submit
  function onError(err) {
    let errorName = '';
    if ('username' in err) errorName = 'username';
    else if ('email' in err) errorName = 'email';
    else if ('phone' in err) errorName = 'phone';
    else if ('password' in err) errorName = 'password';
    else if ('address' in err) errorName = 'address';
    toast(err[errorName].message, { toastId: 'asdf' });
    setFocus(errorName);
  }

  return (
    <section id='login' className='px-5 md:px-10 flex justify-center'>
      <div className='my-10 bg-amber-100 rounded-lg w-full sm:w-1/2'>
        <h1 className='flex justify-center gap-3 bg-amber-900 rounded-t-lg p-4 text-white text-center text-2xl'>
          <span className='my-auto'><FaUserPlus /></span>
          <span className='my-auto'>Register</span>
        </h1>
        <form onSubmit={handleSubmit(onSubmit, onError)} className='p-5'>
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 my-8'>
            <Input
              placeholder="Username"
              name="username"
              icon=<FaCircleUser />
              register={register}
              message="Username is required"
              errMessage={errors.username?.message}
            />
            <Input
              placeholder="Email"
              name="email"
              icon=<FaEnvelope />
              register={register}
              message="Email is required"
              errMessage={errors.email?.message}
              regEx={/[a-z0-9]+@gmail.com$/}
            />
            <Input
              placeholder="Phone Number"
              name="phone"
              icon=<FaPhone />
              register={register}
              message="Phone Number is required"
              errMessage={errors.phone?.message}
              length={10}
              type='number'
              minimumLength={10}
            />
            <Input
              placeholder="Password"
              name="password"
              icon=<FaKey />
              register={register}
              message="Password is required"
              errMessage={errors.password?.message}
              type='password'
              minimumChars={4}
            />

            <div className='xl:col-span-2 flex flex-col rounded-t-lg'>
              <textarea {...register("address", { required: "Address is Required" })} placeholder="Address" className='p-2 text-sm sm:text-base border border-gray-300 outline-none w-full bg-gray-100 text-amber-900 resize-none' rows="3" />
              {errors.address ? (
                <span name={props.name} className='text-sm text-amber-900'>{errors.address.message}</span>
              ) : (
                <div className='h-5'></div>
              )}
            </div>
            <div className='xl:col-span-2'>
              <button className={`${!submitBtnActive && 'button-loading'} h-10 p-2 bg-amber-900 text-white w-full rounded-lg scale-animation`}>
                {!submitBtnActive ? '' : 'Register'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Register