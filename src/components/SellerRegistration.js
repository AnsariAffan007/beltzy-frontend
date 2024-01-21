import React, { useEffect, useState } from 'react'
import Banner from './Banner';
import { FaCircleUser, FaEnvelope, FaPhone, FaKey, FaUserCheck, FaStore, FaCity, FaTrain, FaLocationDot, FaUpload, FaCircleXmark } from 'react-icons/fa6';
import Input from './Input';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import useAuthenticator from './hooks/useAuthenticator';
import { useNavigate } from 'react-router-dom';
import { useIsAuthenticated } from 'react-auth-kit';
import { toast } from 'react-toastify';

const SellerRegistration = (props) => {

  const signInUser = useAuthenticator();
  const navigate = useNavigate();

  const { register, handleSubmit, setFocus, setError, formState: { errors } } = useForm();

  const isAuthenticated = useIsAuthenticated()();
  useEffect(() => {
    if (isAuthenticated) navigate('/');
    setFocus('username');
  }, [isAuthenticated, navigate, setFocus])

  const [sellerImageFile, setSellerImageFile] = useState('');

  const [submitBtnActive, setSubmitBtnActive] = useState(true);

  const onSubmit = (data) => {
    if (data.password !== data.confirmPass) {
      // document.querySelector('span[name=confirmPass]').innerHTML = "Passwords do not match!";
      setError('confirmPass', { type: 'password mismatch', message: 'Passwords do not match !' });
      toast("Passwords do not match!", { toastId: 'hehe' });
      return;
    }
    else if (!sellerImageFile) {
      toast('You forgot to upload your beautiful image', { toastId: 'hehe' });
    }
    else {
      if(!submitBtnActive) {
        toast('Please wait while your account is being registered', {toastId: 'no dups'});
        return;
      }
      setSubmitBtnActive(false);

      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== 'confirmPass') formData.append(key, data[key]);
      });
      formData.append('sellerImage', sellerImageFile);
      regUser(formData);
    }
  }

  // Image Selection
  const getImage = (e) => {
    if (e.target.value === "") {
      setSellerImageFile('');
    }
    else {
      const uploadedImage = e.target.files[0];
      setSellerImageFile(uploadedImage);
    }
  }

  // Register user after modifying form data from onSubmit
  function regUser(formData) {
    axios({
      method: "POST",
      url: "/seller-register",
      withCredentials: true,
      data: formData
    })
      .then((res) => {
        let sellerData = res.data.newSeller;
        sellerData.role = 'seller';
        sellerData.profileImage = sellerData.profileImage.url;
        signInUser({
          token: res.data.token,
          expiresIn: 3600,
          tokenType: "Bearer",
          authState: sellerData
        });
        props.setUserState(true, sellerData, 'seller');
        setSubmitBtnActive(true);
        toast("Registration Successful", {toastId: 'no dups'});
        navigate(`/${res.data.newSeller.username}/dashboard`);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 409) {
          setError('username', { type: 'Username exists', message: 'Please choose a different Username' })
          toast(err.response.data, {toastId: 'no dups'});
        }
        setSubmitBtnActive(true);
      })
  }

  // On Validation Error
  function onError(err) {
    let errorName = '';
    let errorMessage = (err[Object.keys(err)[0]]).message
    if (err[Object.keys(err)[0]].type === 'required') {
      errorMessage = errorMessage.substr(errorMessage.indexOf(" ") + 1);
    };
    if ('username' in err) errorName = 'username';
    else if ('email' in err) errorName = 'email';
    else if ('phone' in err) errorName = 'phone';
    else if ('password' in err) errorName = 'password';
    else if ('confirmPass' in err) errorName = 'confirmPass';
    else errorName = 'Specify';

    if (errorName === 'Specify') {
      toast(errorName + " " + errorMessage.charAt(0).toLowerCase() + errorMessage.slice(1), { toastId: 'no-dups-bro' });
    }
    else {
      toast(err[errorName].message, { toastId: 'asdf' });
    }
  }


  return (
    <section id='seller-registration' className=''>

      <Banner background='bg-gray-100' textColor='text-gray-800' text='Seller Registration' />

      <div className='px-5 md:px-10'>
        <form onSubmit={handleSubmit(onSubmit, onError)} className='p-5 my-20 shadow-[0_0px_10px_rgba(0,0,0,0.25)]'>
          <div className='mb-10'>
            <h2 className='text-2xl font-bold text-amber-900 mb-8'>Personal Details</h2>

            {sellerImageFile
              ?
              <div className='relative mb-12'>
                <img className='sm:w-1/2 lg:w-1/3 mx-auto' src={URL.createObjectURL(sellerImageFile)} alt="couldn't load" />
                <div className='absolute top-0 right-0 text-amber-900 text-2xl hover:cursor-pointer' onClick={() => setSellerImageFile('')}><FaCircleXmark /></div>
              </div>
              :
              <div className='h-80 border-2 border-amber-900 border-dashed flex justify-center mb-12 sm:w-1/2 mx-auto'>
                <label htmlFor='seller-image-picker' className='flex space-x-3 p-2 bg-amber-900 text-white rounded-lg h-fit my-auto hover:cursor-pointer scale-animation'>
                  <FaUpload className='my-auto' />
                  <span className='my-auto'>Upload Image</span>
                </label>
                <input type="file" id='seller-image-picker' className='hidden' name="image" accept="image/png, image/jpeg, image/jpg" onChange={getImage} />
              </div>
            }

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>

              {/* <div className='h-fit'>
                <label htmlFor='seller-image-picker' className='flex bg-gray-100'>
                  <span className='bg-amber-900 text-white p-3 rounded-l-lg text-xs'><FaFileImage /></span>
                  <span ref={pathDisplayer} className='my-auto w-full text-gray-400 pl-2 sm:pl-4 text-sm sm:text-base'>Choose Proper Facial Image</span>
                </label>
                <input type="file" id='seller-image-picker' className='hidden' name="image" accept="image/png, image/jpeg, image/jpg" onChange={getImage} />
                <div className='h-5 no-image-error-displayer text-sm text-amber-900'></div>
              </div> */}

              <Input
                placeholder="Username"
                name="username"
                icon=<FaCircleUser />
                register={register}
                message="Username is required"
                errMessage={errors.username?.message}
              />
              <Input
                placeholder="Email - OTP Verifications"
                name="email"
                icon=<FaEnvelope />
                register={register}
                message="Email is Required"
                errMessage={errors.email?.message}
                regEx={/[a-z0-9]+@gmail.com$/}
              />
              <Input
                placeholder="Phone Number"
                name="phone"
                icon=<FaPhone />
                register={register}
                message="Phone Number is Required"
                errMessage={errors.phone?.message}
                length={10}
                minimumLength={10}
                type='number'
              />
              <Input
                placeholder="Password"
                name="password"
                icon=<FaKey />
                register={register}
                message="Password is Required"
                errMessage={errors.password?.message}
                type='password'
                minimumChars={4}
              />
              <Input
                placeholder="Confirm Password"
                name="confirmPass"
                icon=<FaUserCheck />
                register={register}
                message="Confirm your password"
                errMessage={errors.confirmPass?.message}
                type='password'
              />
            </div>
          </div>
          <div className='mb-10'>
            <h2 className='text-2xl font-bold text-amber-900 mb-8'>Shop Details</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Input
                placeholder="Shop Name"
                name="shopName"
                icon=<FaStore />
                register={register}
                message="Specify your shop name"
                errMessage={errors?.shopName?.message}
              />
              <Input
                placeholder="City"
                name="city"
                icon=<FaCity />
                register={register}
                message="Specify your city"
                errMessage={errors?.city?.message}
              />
              <Input
                placeholder="Closest Railway Station"
                name="station"
                icon=<FaTrain />
                register={register}
                message="Specify closest Railway station from your shop"
                errMessage={errors?.station?.message}
              />
              <Input
                placeholder="Address"
                name="address"
                icon=<FaLocationDot />
                register={register}
                message="Specify your shop's Address"
                errMessage={errors?.address?.message}
              />
            </div>
          </div>
          <button type='submit' className={`${!submitBtnActive && 'button-loading'} h-10 w-full bg-amber-900 py-2 text-white rounded-lg scale-animation`}>
            {submitBtnActive ? 'Register as Seller' : ''}
          </button>
        </form>
      </div>
    </section>
  )
}

export default SellerRegistration;