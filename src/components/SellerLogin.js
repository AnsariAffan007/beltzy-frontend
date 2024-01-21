import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from './Input';
import { FaKey, FaCircleUser, FaLock, FaEnvelope, FaEyeSlash, FaArrowLeftLong } from 'react-icons/fa6';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import useAuthenticator from './hooks/useAuthenticator';
import { useIsAuthenticated } from 'react-auth-kit';
import { toast } from 'react-toastify';


const SellerLogin = (props) => {

  const { register, handleSubmit, setFocus, setError, formState: { errors }, reset } = useForm();
  const signInUser = useAuthenticator();

  const navigate = useNavigate();

  const isAuthenticated = useIsAuthenticated()();
  useEffect(() => {
    if (isAuthenticated) navigate('/');
    setFocus('username')
  }, [isAuthenticated, navigate, setFocus])

  const [otpTab, setOtpTab] = useState({
    otpActive: false,
    userId: null
  });

  let [loginBtnActive, setLoginBtnActive] = useState(true);
  let [otpBtnActive, setOtpBtnActive] = useState(true);

  let toastId = useRef(null);

  // Submit Form
  async function onSubmit(data) {
    if (!loginBtnActive) {
      toast('Please wait while OTP is being generated', { toastId: 'no dups' });
      return;
    }
    setLoginBtnActive(false);
    toastId.current = toast('Generating OTP...', { toastId: 'hehe' });
    try {
      const res = await axios({
        method: "POST",
        url: "/seller-login",
        withCredentials: true,
        data: {
          username: data.username,
          email: data.email,
          password: data.password,
        }
      })
      if (res) {
        toast.dismiss(toastId.current);
        if (res.data.exists) {
          toast('OTP Already Sent! Please check your Email')
        }
        else {
          toast('OTP Sent! Please check your Email')
        }
        setOtpTab({ otpActive: true, userId: res.data.userId });
      }
    }
    catch (err) {
      toast.dismiss(toastId.current);
      setError(err.response.data.type, { type: err.response.data.type, message: err.response.data.message }, { shouldFocus: true })
      toast(err.response.data.message, { toastId: 'no dups id' });
    }
    setLoginBtnActive(true);
  }

  // Submit OTP
  function handleOTP(otp) {
    if (!otpBtnActive) {
      toast('Please wait while your OTP is being validated', { toastId: 'no dups' });
      return;
    }
    setOtpBtnActive(false);
    let postData = {
      userId: otpTab.userId,
      otp: otp.otp
    }
    axios({
      method: 'POST',
      url: '/verify-otp',
      withCredentials: true,
      data: postData
    })
      .then((res) => {
        let sellerData = res.data.seller;
        sellerData.role = 'seller';
        sellerData.profileImage = sellerData.profileImage.url;
        signInUser({
          token: res.data.token,
          expiresIn: 3600,
          tokenType: "Bearer",
          authState: sellerData
        });
        props.setUserState(true, sellerData, 'seller');
        setOtpTab({ otpActive: false });
        toast('Sign in Successful !');
        setOtpBtnActive(true);
        navigate(`/${res.data.seller.username}/dashboard`);

      })
      .catch((err) => {
        if (err.response?.status === 404) {
          toast(err.response.data);
          setOtpTab({ otpActive: false });
        }
        if (err.response?.status === 401) {
          setError('otp', { type: 'otp', message: err.response.data }, { shouldFocus: true });
          toast(err.response.data, { toastId: 'no dups' });
        }
        setOtpBtnActive(true);
      })

  }

  // Handling validation errors
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
    toast(errorName + " " + errorMessage.charAt(0).toLowerCase() + errorMessage.slice(1), { toastId: 'hehe' });
  }

  useEffect(() => {
    reset();
  }, [otpTab, reset])

  return (
    <section id='seller-login' className='px-5 md:px-10 flex justify-center'>
      <div className='my-14 bg-amber-100 rounded-lg w-full sm:w-80'>
        <h1 className='bg-amber-900 rounded-t-lg p-4 text-white text-center text-2xl'>Seller Login</h1>
        <div className='p-5'>
          {otpTab.otpActive && <button onClick={() => setOtpTab({ otpActive: false })} className='flex text-sm text-amber-900 gap-2 align-middle'><span className='my-auto'><FaArrowLeftLong /></span><span className='my-auto'>Back</span></button>}
          <div className='my-6 flex'>
            <span className='mx-auto text-3xl text-amber-900'><FaLock /></span>
          </div>
          {!otpTab.otpActive ?
            <form onSubmit={handleSubmit(onSubmit, onError)} className='grid grid-cols-1 gap-6'>
              <Input
                icon=<FaCircleUser />
                placeholder="Username"
                name='username'
                register={register}
                message="Username is required"
                errMessage={errors.username?.message}
                type='text'
              />
              <Input
                icon=<FaEnvelope />
                placeholder="Email"
                name='email'
                register={register}
                message="Email is required"
                errMessage={errors.email?.message}
                regEx={/[a-z0-9]+@gmail.com$/}
              />
              <Input
                icon=<FaKey />
                placeholder="Password"
                name='password'
                register={register}
                message="Password is required"
                errMessage={errors.password?.message}
                type='password'
              />
              <div className='mt-20'>
                <button className={`${!loginBtnActive && 'button-loading'} h-10 mb-6 p-2 bg-amber-900 text-white w-full rounded-lg scale-animation`}>
                  {!loginBtnActive ? '' : 'Login'}
                </button>
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
                <button className={`${!otpBtnActive && 'button-loading'} h-10 mb-6 p-2 bg-amber-900 text-white w-full rounded-lg scale-animation`}>
                  {!otpBtnActive ? '' : 'Submit'}
                </button>
              </div>
            </form>
          }
          <div className='text-xs sm:text-sm text-amber-900 text-center'><Link to="/seller-registration"><span className='underline'>Create Seller Account Here</span></Link></div>
        </div>
      </div>
    </section>
  )
}

export default SellerLogin;