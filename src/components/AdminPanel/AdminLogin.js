import React, { useEffect, useRef, useState } from 'react'
import { FaUserLock, FaCircleUser, FaEyeSlash, FaArrowLeftLong } from 'react-icons/fa6';
import { useForm } from 'react-hook-form';
import Input from '../Input';
import { toast } from 'react-toastify';
import axios from 'axios';
import useAuthenticator from '../hooks/useAuthenticator';
import { useIsAuthenticated } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ setUserState }) => {

  const { register, handleSubmit, setError, formState: { errors }, reset } = useForm();
  const signInUser = useAuthenticator();
  const navigate = useNavigate();

  const isAuthenticated = useIsAuthenticated()();
  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate])

  const [otpTab, setOtpTab] = useState({
    otpActive: false,
    userId: null
  });

  let toastId = useRef(null)

  function onSubmit(data) {
    toastId.current = toast('Generating OTP...');
    axios({
      method: 'POST',
      url: '/admin-login',
      withCredentials: true,
      data: {
        username: data.username,
        email: data.email,
        password: data.password
      }
    }).then((res) => {
      toast.dismiss(toastId.current);
      if (res.data.exists) {
        toast('OTP Already Sent! Please check your Email')
      }
      else {
        toast('OTP Sent! Please check your Email')
      }
      setOtpTab({ otpActive: true, userId: res.data.userId });
      return;
    })
      .catch((err) => {
        toast.dismiss(toastId.current);
        setError(err.response.data.type, { type: err.response.data.type, message: err.response.data.message }, { shouldFocus: true })
        toast(err.response.data.message);
      })

  }

  // Submit OTP
  function handleOTP(otp) {
    let postData = {
      userId: otpTab.userId,
      otp: otp.otp
    }
    axios({
      method: 'POST',
      url: '/verify-admin-otp',
      withCredentials: true,
      data: postData
    })
      .then((res) => {
        let adminData = res.data.admin;
        adminData.role = 'admin';
        signInUser({
          token: res.data.token,
          expiresIn: 3600,
          tokenType: "Bearer",
          authState: adminData
        })
        setUserState(true, res.data.admin, 'admin')
        setOtpTab({ otpActive: false });
        navigate(`/admin/dashboard`);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast(err.response.data);
          setOtpTab({ otpActive: false });
        }
        if (err.response.status === 401) {
          setError('otp', { type: 'otp', message: err.response.data }, { shouldFocus: true });
          toast(err.response.data);
        }
      })
  }

  // Validation Errors handling
  function onError(err) {
    let errorName;
    let errorMessage = (err[Object.keys(err)[0]]).message
    if (err[Object.keys(err)[0]].type === 'required') {
      errorMessage = errorMessage.substr(errorMessage.indexOf(" ") + 1);
    };
    if (Object.keys(err)[0] === 'username') errorName = 'Username';
    if (Object.keys(err)[0] === 'email') errorName = 'Email';
    if (Object.keys(err)[0] === 'password') errorName = 'Password';
    if (Object.keys(err)[0] === 'otp') errorName = 'OTP';
    toast(errorName + " " + errorMessage.charAt(0).toLowerCase() + errorMessage.slice(1));
  }

  useEffect(() => {
    reset();
  }, [otpTab, reset])

  return (
    <section id='admin-login' className='px-5 md:px-10 flex justify-center'>
      <div className='my-14 bg-amber-100 rounded-lg w-full sm:w-80'>
        <h1 className='bg-amber-900 rounded-t-lg p-4 text-white text-center text-2xl'>Admin Login</h1>
        <div className='p-5'>
          {otpTab.otpActive && <button onClick={() => setOtpTab({ otpActive: false })} className='flex text-sm text-amber-900 gap-2 align-middle'><span className='my-auto'><FaArrowLeftLong /></span><span className='my-auto'>Back</span></button>}
          <div className='mt-6 mb-4 sm:mb-8 flex'>
            <span className='mx-auto text-3xl text-amber-900'><FaUserLock /></span>
          </div>
          {!otpTab.otpActive ?
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              <div className='grid grid-cols-1 gap-6'>
                <Input
                  icon=<FaCircleUser />
                  placeholder="Username"
                  name='username'
                  register={register}
                  message="Username is required"
                  errMessage={errors.username?.message}
                  type='text'
                />
                {/* <Input
              icon=<FaCircleUser />
              placeholder="Phone Number"
              name='phone'
              register={register}
              message="Phone Number is required"
              errMessage={errors.username?.message}
              type='number'
            /> */}
                <Input
                  icon=<FaCircleUser />
                  placeholder="Email"
                  name='email'
                  register={register}
                  message="Email is required"
                  errMessage={errors.email?.message}
                  type='text'
                  regEx={/[a-z0-9]+@gmail.com$/}
                />
                <Input
                  icon=<FaCircleUser />
                  placeholder="Password"
                  name='password'
                  register={register}
                  message="Password is required"
                  errMessage={errors.password?.message}
                  type='password'
                />
                {/* <Input icon=<FaCircleUser /> placeholder="Username" />
            <Input icon=<FaPhone /> placeholder="Phone Number" />
            <Input icon=<FaKey /> placeholder="Password" />
            <Input icon=<FaUserSecret /> placeholder="Secret" />
            <Input icon=<FaEyeSlash /> placeholder="Enter OTP" /> */}
              </div>
              <div className='mt-10'>
                <button className='mb-6 p-2 bg-amber-900 text-white w-full rounded-lg'>Login</button>
              </div>
            </form>
            :
            <form onSubmit={handleSubmit(handleOTP, onError)}>
              <Input
                icon=<FaEyeSlash />
                placeholder="Enter OTP"
                name='otp'
                register={register}
                message="OTP is required"
                errMessage={errors.otp?.message}
                type='password'
              />
              <div className='mt-20'>
                <button className='mb-6 p-2 bg-amber-900 text-white w-full rounded-lg'>Submit</button>
              </div>
            </form>
          }
        </div>
      </div>
    </section>
  )
}

export default AdminLogin