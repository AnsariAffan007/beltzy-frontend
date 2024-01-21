import React, { useEffect, useRef } from 'react'
import {  FaPen, FaCircleCheck } from 'react-icons/fa6'


const SellerOrder = (props) => {

  function processOrder() {
    props.setProcess(props.order);
  }

  let dateRef = useRef();
  useEffect(() => {
    const dateString = props.order.createdAt; // Replace this with your date string
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Months are zero-indexed, so adding 1
    const year = date.getUTCFullYear();

    dateRef.current.innerHTML = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  }, [props.order])

  return (
    <div className='order p-5 shadow-[0_0px_10px_rgba(0,0,0,0.25)] flex flex-col xl:flex-row space-x-0 xl:space-x-6 text-sm sm:text-base gap-y-1 sm:gap-y-0'>
      <div className='flex flex-row xl:flex-col relative my-auto'>
        <span className='text-gray-500'>Buyer</span>
        <span className='absolute left-28 xl:static'>{props.order.buyerName}</span>
      </div>
      <div className='flex flex-row xl:flex-col relative my-auto'>
        <span className='text-gray-500'>Order Date</span>
        <span className='absolute left-28 xl:static' ref={dateRef}></span>
      </div>
      <div className='flex flex-row xl:flex-col relative my-auto'>
        <span className='text-gray-500'>Total Amount</span>
        <span className='absolute left-28 xl:static'>{props.order.totalAmount}</span>
      </div>
      <div className='flex flex-row xl:flex-col relative my-auto'>
        <span className='text-gray-500'>Status</span>
        {props.order.status === 0 &&
          <span className='absolute left-28 xl:static text-red-600'>
            Un-processed</span>
        }
        {props.order.status === 1 &&
          <span className='absolute left-28 xl:static text-yellow-500'>
            Processed</span>
        }
        {props.order.status === 2 &&
          <span className='absolute left-28 xl:static text-green-600'>
            Out for Delivery</span>
        }
        {props.order.status === 3 &&
          <div className='absolute left-28 xl:static text-green-600 flex gap-x-2'>
            <FaCircleCheck className='my-auto' />
            <span className='my-auto'>Delivered</span>
          </div>
        }
      </div>
      <div className='flex flex-row justify-end space-x-2 mt-4 sm:mt-0 flex-1'>
        {/* <button className='h-fit my-auto p-2 bg-gray-200 rounded-md'>
          <span className='my-auto'><FaTrash /></span>
        </button> */}
        <button onClick={processOrder} className='h-fit my-auto p-2 bg-gray-200 text-amber-900 ml-5 xl:ml-0 rounded-md flex gap-x-2'>
          <FaPen className='my-auto' />
          <span className='my-auto'>View</span>
        </button>
      </div>
    </div>
  )
}

export default SellerOrder