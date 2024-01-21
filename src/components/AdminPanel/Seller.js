import React from 'react'
import { FaArrowRight } from 'react-icons/fa6'

const Seller = (props) => {

  function showProducts() {
    props.showProducts(props.seller._id)
  }

  function changeVerification(e) {
    e.target.disabled = true;
    props.changeVerification(props.seller._id, e.target.checked);
    e.target.disabled = false;
  }

  return (
    <div className='shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
      <div className='flex pt-5 px-5' id='image-username'>
        <img className='h-28 w-28 xl:h-40 xl:w-40 rounded-full' src={props.seller.profileImage} alt="Couldn't load" />
        <div className='h-fit my-auto ms-4 space-y-1'>
          <div onClick={showProducts} className='flex text-sm underline cursor-pointer'>
            Products <FaArrowRight className='mt-0.5 ms-2' />
          </div>
          <div className='text-2xl'>{props.seller.username}</div>
          <div className='flex'>
            <span className='me-2'>Verified : </span>
            <label className="switch">
              <input type="checkbox" defaultChecked={props.seller.verified} onChange={changeVerification} />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
      <div className='bg-amber-100 px-5 pt-12 pb-5 space-y-3 -mt-2'>
        <div className='relative'>
          <span>Shop Name</span>
          <span className='absolute left-32'> : {props.seller.shopName}</span>
        </div>
        <div className='relative'>
          <span>Shop City</span>
          <span className='absolute left-32'> : {props.seller.city}</span>
        </div>
        <div className='relative'>
          <span>Closest Station</span>
          <span className='absolute left-32'> : {props.seller.closestStation}</span>
        </div>
        <div>
          <p>{props.seller.address}</p>
        </div>
      </div>
      <div className='bg-amber-700 p-5 text-white text-sm lg:text-base'>
        <div className='relative'>
          <span>Email</span>
          <span className='absolute left-32 top-0'> : {props.seller.email}</span>
        </div>
        <div className='relative'>
          <span>Phone Number</span>
          <span className='absolute left-32 top-0'> : +91 {props.seller.phoneNumber}</span>
        </div>
      </div>
    </div>
  )
}

export default Seller