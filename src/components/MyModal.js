import React from 'react'
import { FaCircleXmark } from 'react-icons/fa6'

const MyModal = (props) => {
  return (
    <div className={`${props.open ? 'visible bg-black/50' : 'invisible'} z-10 transition-colors fixed inset-0 flex justify-center items-center`} onClick={props.hideModalOnBodyClick}>
      <div id='my-modal' className={`p-5 w-80 transition-all bg-white shadow-md ${!props.sellerDetails && 'pb-10'} ${props.open ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
        <div className='flex justify-between'>
          <span className='my-auto text-lg'>Seller Details</span>
          <FaCircleXmark className='my-auto ms-auto bg-white rounded-full text-amber-900' onClick={props.hideModal} />
        </div>
        <hr className='my-3 border-amber-900' />
        {!props.sellerDetails
          ?
          <div className='my-10 button-loading after:border-amber-900'></div>
          :
          <div className='text-slate-800 text-sm space-y-2'>
            <div className='flex justify-between'>
              <span>Name</span>
              <span>{props.sellerDetails.username}</span>
            </div>
            <div className='flex justify-between'>
              <span>Phone Number</span>
              <span>{props.sellerDetails.phoneNumber}</span>
            </div>
            <div className='flex justify-between'>
              <span>Email</span>
              <span>{props.sellerDetails.email}</span>
            </div>
            <hr />
            <div className='flex justify-between'>
              <span>Shop Name</span>
              <span>{props.sellerDetails.shopName}</span>
            </div>
            <div className='flex justify-between'>
              <span>City</span>
              <span>{props.sellerDetails.city}</span>
            </div>
            <div className='flex justify-between'>
              <span>Close to</span>
              <span><span className='text-amber-900'>{props.sellerDetails.closestStation}</span> railway Station</span>
            </div>
            <div className='flex justify-between'>
              <span>Address</span>
              <span>{props.sellerDetails.address}</span>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default MyModal