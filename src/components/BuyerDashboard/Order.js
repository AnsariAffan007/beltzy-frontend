import axios from 'axios'
import React, { useEffect, useRef } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import { FaCircleCheck } from 'react-icons/fa6'
import { toast } from 'react-toastify'

const Order = (props) => {

  const authHeader = useAuthHeader();

  const confirmDelivery = async () => {
    if (props.order.status === 2) {
      const yesNo = window.confirm('Did the seller deliver the products to you ?');
      if (!yesNo) return;
      try {
        const res = await axios({
          method: 'PUT',
          url: '/confirm-delivery',
          withCredentials: true,
          headers: {
            Authorization: authHeader()
          },
          data: {
            id: props.order._id
          }
        })
        if (res.data.success) {
          props.confirmDelivery(props.order._id);
          toast('Delivery Confirmed!');
        }
      }
      catch (err) {
        if (err.response.status === 401) {
          toast(err.response.data.message);
          props.signOut();
        }
      }
    }
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
    <div className='order border mb-6 bg-gray-100 border-gray-300 text-sm' >
      <div className='p-4 flex flex-col lg:flex-row justify-between gap-4'>
        <span className='my-auto '>Seller : {props.order.sellerName} <span className='underline text-amber-900 hover:cursor-pointer' onClick={() => props.modalOpener(props.order.sellerName)}>(Details)</span></span>
        <span className='my-auto ' ref={dateRef}></span>
        <span className='my-auto '>Total Amount : &#x20B9;{props.order.totalAmount}</span>
        {props.order.status === 0 &&
          <span className='my-auto text-red-800 p-2 rounded-lg w-fit' style={{ backgroundColor: '#f8d7da' }}>
            Un-processed</span>
        }
        {props.order.status === 1 &&
          <span className='my-auto p-2 rounded-lg w-fit bg-yellow-100 text-yellow-600'>
            Processed</span>
        }
        {props.order.status === 2 &&
          <span className='my-auto p-2 rounded-lg w-fit bg-green-100 text-green-600'>
            Out for Delivery</span>
        }
        {props.order.status === 3 &&
          <div className='my-auto p-2 rounded-lg w-fit bg-green-100 text-green-600 flex gap-x-2'>
            <FaCircleCheck className='my-auto' />
            <span className='my-auto'>Delivered</span>
          </div>
        }
      </div>
      <div className='block overflow-x-auto'>
        <table className='w-full border-collapse table-auto whitespace-nowrap border-2 border-slate-200' style={{ minWidth: '700px' }}>
          <thead className='bg-white'>
            <tr className='text-left'>
              <th className='p-4 border border-slate-200'>Image</th>
              <th className='p-4 border border-slate-200'>Name</th>
              <th className='p-4 border border-slate-200'>Brand</th>
              <th className='p-4 border border-slate-200'>Size</th>
              <th className='p-4 border border-slate-200'>Price</th>
            </tr>
          </thead>
          <tbody className=''>
            {props.order.products.map((product, index) => (
              <tr className='' key={index}>
                <td className='p-4 border border-slate-200 underline text-amber-900'>
                  <a href={product.productImage} rel='noreferrer' target='_blank'>View</a>
                </td>
                <td className='p-4 border border-slate-200'>{product.productName}</td>
                <td className='p-4 border border-slate-200'>{product.brand}</td>
                <td className='p-4 border border-slate-200'>{product.size}</td>
                <td className='p-4 border border-slate-200'>&#x20B9;{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {props.order.status === 2 &&
        <div className='flex flex-col sm:flex-row justify-between'>
          <div className='my-auto p-4'>
            {props.order.status === 0 &&
              <span className='my-auto text-red-800 p-2 rounded-lg w-fit' style={{ backgroundColor: '#f8d7da' }}>
                Un-processed</span>
            }
            {props.order.status === 1 &&
              <span className='my-auto p-2 rounded-lg w-fit bg-yellow-100 text-yellow-600'>
                Processed</span>
            }
            {props.order.status === 2 &&
              <span className='my-auto p-2 rounded-lg w-fit bg-green-100 text-green-600'>
                Out for Delivery</span>
            }
          </div>
          <div className='ps-6 pt-0 pb-4 sm:p-4 flex gap-x-4 sm:justify-end'>
            <span className='my-auto'>Delivered ? </span>
            <button className='py-1 px-4 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex gap-x-2' onClick={confirmDelivery}
            >
              <span className='my-auto'>Yes</span>
              <FaCircleCheck className='my-auto' />
            </button>
          </div>
        </div>
      }
      <div></div>
    </div>
  )
}

export default Order