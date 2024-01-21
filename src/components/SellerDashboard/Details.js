import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaPhone, FaStore, FaCity, FaTrain, FaLocationDot, FaUpload, FaCircleXmark } from 'react-icons/fa6';
import Input from '../Input';
import useAuthenticator from '../hooks/useAuthenticator';
import axios from 'axios'
import { useAuthHeader, useSignOut } from 'react-auth-kit';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Details = (props) => {

  let [submitBtnActive, setSubmitBtnActive] = useState(true);
  let timeOutActive = false;

  const navigate = useNavigate();
  const signInUser = useAuthenticator();
  const authHeader = useAuthHeader();

  function setImage(e) {
    if (e.target.files && e.target.files.length > 0) {
      props.setProfilePic({ file: true, link: false, image: e.target.files[0] });
    }
  }
  function removeImage() {
    props.setProfilePic({ file: false, link: false, image: '' });
  }
  const image = function () {
    if (props.profilePic.file) {
      return URL.createObjectURL(props.profilePic.image);
    }
    else if (props.profilePic.link) {
      return props.profilePic.image;
    }
    else return false;
  }();

  const { register, handleSubmit, reset, formState: { errors, isDirty, dirtyFields } } = useForm({
    defaultValues: {
      email: props.userDetails.email,
      phoneNumber: props.userDetails.phoneNumber,
      shopName: props.userDetails.shopName,
      city: props.userDetails.city,
      closestStation: props.userDetails.closestStation,
      address: props.userDetails.address
    }
  });

  useEffect(() => {
    reset({
      email: props.userDetails.email,
      phoneNumber: props.userDetails.phoneNumber,
      shopName: props.userDetails.shopName,
      city: props.userDetails.city,
      closestStation: props.userDetails.closestStation,
      address: props.userDetails.address
    })
  }, [reset, props.userDetails])

  const signOut = useSignOut();
  function signOutUser() {
    signOut();
    props.setUserState(false, {}, 'visitor');
    navigate('/');
  }

  function onSubmit(data) {

    if (!submitBtnActive) {
      toast('Please wait 10 seconds after previous updation.', {toastId: 'no dups'})
      return;
    }
    if (!isDirty) {
      toast("No changes were made to your details.", {toastId: 'no dups'})
      return;
    };
    setSubmitBtnActive(false)
    if (!timeOutActive) {
      timeOutActive = true;
      setTimeout(() => {
        setSubmitBtnActive(true);
        timeOutActive = false
      }, 10000);
    }

    data.profileImage = undefined
    data.role = undefined;
    data.flag = undefined;
    data.verified = undefined;
    data.username = undefined;
    let newData = [props.userDetails.username, {
      ...data
    }];

    axios({
      method: "POST",
      url: "/update-seller",
      data: newData,
      withCredentials: true,
      headers: {
        Authorization: authHeader()
      }
    })
      .then(response => {
        let sellerData = response.data.seller;
        sellerData.profileImage = sellerData.profileImage.url;
        sellerData.role = 'seller';
        signInUser({
          token: response.data.token,
          expiresIn: 3600,
          tokenType: "Bearer",
          authState: sellerData
        });

        // Making a string of updated details to show in toast.
        let updatedDetails = Object.keys(dirtyFields).map((fieldName) => {
          if (fieldName === 'email') return "Email"
          else if (fieldName === 'phoneNumber') return "Phone Number"
          else if (fieldName === 'shopName') return "Shop Name"
          else if (fieldName === 'city') return "City"
          else if (fieldName === 'closestStation') return "Closest Station"
          else if (fieldName === 'address') return "Address"
          else return ''
        }).toString().replaceAll(',', ', ')

        toast(<><span className="text-amber-900">{updatedDetails}</span><span className='text-black'> was updated !</span></>);
        props.setUserState(true, sellerData, 'seller');
      }).catch(err => {
        console.log(err);
        if (err.response?.status === 401) {
          toast("Your session has expired! Please Login Again. ");
          signOutUser();
        }
      })
  }

  // Update profile image
  function updateProfilePic() {

    if (!props.profilePic.file) {
      toast('Image not changed!', {toastId: 'no dups'});
      return;
    }

    if (!submitBtnActive) {
      toast('Please wait 10 seconds after previous updation.', {toastId: 'no dups'});
      return;
    }
    setSubmitBtnActive(false);
    if (!timeOutActive) {
      timeOutActive = true;
      setTimeout(() => {
        setSubmitBtnActive(true);
        timeOutActive = false;
      }, 10000);
    }

    const formData = new FormData();
    formData.append('username', props.userDetails.username);
    formData.append('sellerImage', props.profilePic.image);

    axios({
      method: "POST",
      url: "/update-seller-profile-pic",
      data: formData,
      withCredentials: true,
      headers: {
        Authorization: authHeader()
      }
    })
      .then((res) => {
        props.setUserState(true, { ...props.userDetails, profileImage: res.data.updatedImage }, 'seller');
        props.setProfilePic({ file: false, link: true, image: res.data.updatedImage });
        signInUser({
          token: res.data.token,
          expiresIn: 3600,
          tokenType: "Bearer",
          authState: { ...props.userDetails, profileImage: res.data.updatedImage }
        });
        toast('Profile Picture Updated !');
      })
      .catch(err => {
        if (err.response.status === 401) {
          toast("Your session has expired! Please Login Again. ");
          signOutUser();
        }
        if (err.response.status === 500) {
          toast("Couldn't update image. Try uploading a smaller size image", {toastId: 'no dups'});
        }
      })
  }

  // catch validation errors
  function onError(err) {
    let errorName;
    let errorMessage = (err[Object.keys(err)[0]]).message
    if (err[Object.keys(err)[0]].type === 'required') {
      errorMessage = errorMessage.substr(errorMessage.indexOf(" ") + 1);
    };
    if (Object.keys(err)[0] === 'phoneNumber') errorName = 'Phone Number';
    if (Object.keys(err)[0] === 'email') errorName = 'Email';
    if (Object.keys(err)[0] === 'shopName') errorName = 'Shop';
    if (Object.keys(err)[0] === 'city') errorName = 'City';
    if (Object.keys(err)[0] === 'closestStation') errorName = 'Closest';
    if (Object.keys(err)[0] === 'address') errorName = 'Address';
    toast(errorName + " " + errorMessage.charAt(0).toLowerCase() + errorMessage.slice(1), {toastId: 'no dups'});
  }

  return (
    <div className='shadow-xl p-5 mb-10'>

      <div id='account-details'>
        <h1 className='text-2xl font-bold text-amber-900'>Personal Details</h1>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4'>
          {props.profilePic.link || props.profilePic.file
            ?
            <div className='relative mb-4 pe-8'>
              <img
                className='mx-auto'
                src={image}
                alt="couldn't load"
                loading='lazy'
              />
              <div className='absolute top-0 right-0 text-amber-900 text-2xl hover:cursor-pointer' onClick={removeImage}><FaCircleXmark /></div>
            </div>
            :
            <div className='h-80 p-5 border-2 border-amber-900 border-dashed flex justify-center mb-4'>
              <label htmlFor='seller-img' className='flex space-x-3 p-2 bg-amber-900 text-white rounded-lg h-fit my-auto hover:cursor-pointer'>
                <FaUpload className='my-auto' />
                <span className='my-auto'>Upload Image</span>
              </label>
              <input type="file" id='seller-img' className='hidden' name="image" accept="image/png, image/jpeg, image/jpg" onChange={setImage} />
            </div>
          }
          <div className='flex justify-end align-bottom lg:col-span-3'>
            <button onClick={updateProfilePic} className={`${!submitBtnActive ? 'button-loading' : ''} w-24 h-10 mb-6 lg:mb-0 mt-auto py-2 px-5 bg-amber-900 text-white rounded-lg`} >
              {!submitBtnActive ? '' : 'Update'}
            </button>
          </div>
          <div className='col-span-1 lg:col-span-4 mt-4'>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              <div className='grid grid-cols-1 gap-4 mb-4'>
                <Input
                  placeholder="Email"
                  name='email'
                  icon=<FaEnvelope />
                  register={register}
                  defaultValue={props.userDetails.email}
                  message="Email is Required"
                  errMessage={errors.email?.message}
                  regEx={/[a-z0-9]+@gmail.com$/}
                />
                <Input
                  placeholder="Phone Number"
                  name='phoneNumber'
                  icon=<FaPhone />
                  register={register}
                  defaultValue={props.userDetails.phoneNumber}
                  message="Phone Number is Required"
                  errMessage={errors.phoneNumber?.message}
                  type='number'
                  length={10}
                />
              </div>
              <div className='text-right'>
                <button className={`${!submitBtnActive ? 'button-loading' : ''} w-24 h-10 mb-6 py-2 px-5 bg-amber-900 text-white rounded-lg`} >
                  {!submitBtnActive ? '' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div id='shop-details'>
        <h1 className='text-2xl font-bold'>Shop Details</h1>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 my-4 mt-8'>
            <Input
              placeholder="Shop Name"
              name='shopName'
              icon=<FaStore />
              register={register}
              defaultValue={props.userDetails.shopName}
              message="Shop Name is Required"
              errMessage={errors.shopName?.message}
            />
            <Input
              placeholder="City"
              name='city'
              icon=<FaCity />
              register={register}
              defaultValue={props.userDetails.city}
              message="City is Required"
              errMessage={errors.city?.message}
            />
            <Input
              placeholder="Closest Railway Station"
              name='closestStation'
              icon=<FaTrain />
              register={register}
              defaultValue={props.userDetails.closestStation}
              message="Closest Railway Station is Required"
              errMessage={errors.closestStation?.message}
            />
            <Input
              placeholder="Address"
              name='address'
              icon=<FaLocationDot />
              register={register}
              defaultValue={props.userDetails.address}
              message="Address is Required"
              errMessage={errors.address?.message}
            />
          </div>
          <div className='text-right'>
            <button className={`${!submitBtnActive ? 'button-loading' : ''} w-24 h-10 mb-6 py-2 px-5 bg-amber-900 text-white rounded-lg`} >
              {!submitBtnActive ? '' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Details