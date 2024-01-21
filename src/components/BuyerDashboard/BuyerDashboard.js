import React, { useRef, useEffect, useState, useCallback } from 'react'
import useOnScreen from '../hooks/useOnScreen'
import { FaEnvelope, FaPhone, FaPencil } from "react-icons/fa6";
import { AiOutlineRedo } from "react-icons/ai";
import Order from './Order';
import Banner from '../Banner';
import Input from '../Input';
import { useIsAuthenticated, useAuthHeader, useSignOut } from 'react-auth-kit';
import useAuthenticator from '../hooks/useAuthenticator';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const Dashboard = (props) => {

  let [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const signInUser = useAuthenticator();

  const { register, handleSubmit, formState: { errors, isDirty, dirtyFields }, reset } = useForm({
    defaultValues: {
      email: props.signedIn.email,
      phoneNumber: parseInt(props.signedIn.phoneNumber),
      address: props.signedIn.address
    }
  });

  const authHeader = useAuthHeader();

  const signOut = useSignOut();
  const signOutUser = useCallback(async () => {
    signOut();
    props.setUserState(false, {}, 'visitor');
    navigate('/');
  }, [navigate, props, signOut])

  const getOrders = useCallback(async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/buyer-orders',
        withCredentials: true,
        headers: {
          Authorization: authHeader()
        }
      })
      setOrders(res.data);
    }
    catch (err) {
      if (err.response.status === 401) {
        toast(err.response.data.message);
        signOutUser();
      }
    }
  }, [authHeader, signOutUser])

  let firstRender = useRef(true);
  const isAuthenticated = useIsAuthenticated()();
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      if (isAuthenticated) {
        getOrders();
        if (state?.orderSuccess) document.getElementById('orders').scrollIntoView({ behavior: 'smooth' });
      }
      else {
        toast('Please Login first!');
        navigate('/login');
      }
    }

  }, [navigate, isAuthenticated, reset, state?.orderSuccess, getOrders]);

  useEffect(() => {
    reset({
      email: props.signedIn.email,
      phoneNumber: props.signedIn.phoneNumber,
      address: props.signedIn.address
    });
  }, [props, reset])

  let [submitBtnActive, setSubmitBtnActive] = useState(true);

  const setStatus3 = (id) => {
    setOrders(prev => prev.map(order => ((order._id === id) ? { ...order, status: 3 } : order)))
  }

  // Submitting updated details
  function onSubmit(data) {
    if (!submitBtnActive) {
      toast('Please wait till previous request finished processing', { toastId: 'no dups' })
      return;
    }
    if (!isDirty) {
      toast("No changes were made to your details.", { toastId: 'nodups' })
      return;
    };
    setSubmitBtnActive(false);

    let newData = [props.signedIn.username, {
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address
    }];
    axios({
      method: "POST",
      url: "/update-buyer",
      data: newData,
      withCredentials: true,
      headers: {
        Authorization: authHeader()
      }
    }).then(response => {
      let buyer = response.data.buyer;
      buyer.role = 'buyer';
      signInUser({
        token: response.data.token,
        expiresIn: 120,
        tokenType: "Bearer",
        authState: buyer
      });

      // Making a string of updated details to show in toast.
      let updatedDetails = Object.keys(dirtyFields).map((fieldName) => {
        if (fieldName === 'email') return "Username"
        else if (fieldName === 'phoneNumber') return "Phone Number"
        else if (fieldName === 'address') return "Address"
        else return ''
      }).toString().replaceAll(',', ', ')

      toast(<><span className="text-amber-900">{updatedDetails}</span><span className='text-black'> was updated !</span></>);
      props.setUserState(true, buyer, 'buyer');
      setSubmitBtnActive(true);
    }).catch(err => {
      setSubmitBtnActive(true);
      console.log(err);
      if (err.response.status === 401) {
        toast("Your session has expired! Please Login Again. ");
        signOutUser();
      }
    })
  }

  // catching any errors on form submission
  function onError(err) {
    let errorName;
    let errorMessage = (err[Object.keys(err)[0]]).message
    if (Object.keys(err)[0] === 'phoneNumber') errorName = 'Phone Number';
    if (Object.keys(err)[0] === 'email') errorName = 'Email';
    if (Object.keys(err)[0] === 'address') errorName = 'Address';
    toast(errorName + " " + errorMessage.charAt(0).toLowerCase() + errorMessage.slice(1));
  }

  const accountInfoLink = useRef();
  const bookedProductsLink = useRef();

  const ref = useRef(null);
  const isVisible = useOnScreen(ref);

  useEffect(() => {
    setLink(isVisible);
  }, [isVisible])

  function setLink(orderVisible) {
    if (orderVisible) {
      accountInfoLink.current.style.borderLeft = "3px solid rgb(120, 53, 15)";
      accountInfoLink.current.style.color = "rgb(120, 53, 15)";
      bookedProductsLink.current.style.borderLeft = "3px solid transparent";
      bookedProductsLink.current.style.color = "rgb(75, 85, 99)";
    }
    else {
      bookedProductsLink.current.style.borderLeft = "3px solid rgb(120, 53, 15)";
      bookedProductsLink.current.style.color = "rgb(120, 53, 15)";
      accountInfoLink.current.style.borderLeft = "3px solid transparent";
      accountInfoLink.current.style.color = "rgb(75, 85, 99)";
    }
  }

  return (
    <section id='dashboard'>
      <Banner background='bg-gray-200' textColor='text-gray-900' text={`Welcome, ${props.signedIn.username}!`} />

      <div className='px-5 md:px-10 my-20 grid grid-flow-row grid-cols-1 md:grid-cols-4 gap-0 md:gap-6 gap-y-10'>

        <div>
          <div className='sidebar p-3 rounded shadow-lg md:sticky md:top-10'>
            <h3 className='text-2xl font-bold text-amber-900'>My Details</h3>
            <div className='my-5'>
              <div className='my-1'>
                <div className='hover:cursor-pointer' onClick={() => document.getElementById('account-details').scrollIntoView()}>
                  <span ref={accountInfoLink} className='pl-2'>My Details</span>
                </div>
              </div>
              <div className='my-1'>
                <div className='hover:cursor-pointer' onClick={() => document.getElementById('orders').scrollIntoView()}>
                  <span ref={bookedProductsLink} className='pl-2'>Order History</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-span-3'>

          <div id='account-details' className='shadow-xl p-5 mb-10'>
            <h1 className='text-2xl font-bold mb-6' ref={ref}>Account Details</h1>
            <form onSubmit={handleSubmit(onSubmit, onError)} className='grid grid-cols-1 gap-4'>
              <Input
                placeholder="Email"
                name='email'
                icon=<FaEnvelope />
                register={register}
                message="Email is Required"
                errMessage={errors.email?.message}
                regEx={/[a-z0-9]+@gmail.com$/}
              />
              <Input
                placeholder="Phone Number"
                name='phoneNumber'
                icon=<FaPhone />
                register={register}
                message="Phone Number is Required"
                errMessage={errors.phoneNumber?.message}
                length={10}
                type='number'
              />
              <div className='flex flex-col rounded-lg'>
                <textarea type='text' placeholder="Address" className='p-2 text-sm sm:text-base border border-gray-300 rounded-lg outline-none w-full bg-gray-100 text-amber-900 resize-none' rows="3" {...register('address', { required: "Address is Required" })} />
                <span name={props.name} className='text-sm text-amber-900'>{errors.address?.message}</span>
              </div>
              <div className='flex gap-2 justify-end'>
                <button type='button' onClick={() => reset()} className={`flex gap-1 justify-center text-amber-900 mb-6 w-24 h-10 py-2 px-5 bg-gray-200 rounded-lg scale-animation`}>
                  <span className='my-auto text-lg'><AiOutlineRedo /></span>
                  <span className='my-auto'>Reset</span>
                </button>
                <button className={`${!submitBtnActive ? 'button-loading' : 'flex gap-1 justify-center'} text-white mb-6 w-24 h-10 py-2 px-5 bg-amber-900 rounded-lg scale-animation`}>
                  {!submitBtnActive ? '' :
                    <>
                      <span className='my-auto'><FaPencil /></span>
                      <span className='my-auto'>Update</span>
                    </>}
                </button>
              </div>
            </form>
          </div>

          <div id='orders' className='shadow-xl p-5'>
            <h1 className='text-2xl font-bold mb-5'>Order History</h1>
            <div className=''>
              {orders.map((order, index) => (
                <Order key={index} order={order} signOut={signOutUser} confirmDelivery={setStatus3} modalOpener={props.modalOpener} />
              ))}
            </div>
          </div>
        </div>


      </div>
    </section>
  )
}

export default Dashboard