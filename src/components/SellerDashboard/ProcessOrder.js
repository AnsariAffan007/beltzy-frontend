import React, { useCallback, useState } from 'react'
import { FaArrowLeft, FaCircleCheck } from 'react-icons/fa6'
import axios from 'axios';
import { useAuthHeader, useSignOut } from 'react-auth-kit';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProcessOrder = (props) => {

  const authHeader = useAuthHeader();

  const [disableBtn, setDisableBtn] = useState(false)

  const navigate = useNavigate();

  const signOut = useSignOut();
  const signOutUser = useCallback(() => {
    signOut();
    props.setUserState(false, {}, 'visitor');
    navigate('/seller-login');
  }, [navigate, props, signOut])

  async function updateStatus() {
    const yesNo = window.confirm('Confirm status update');
    if (!yesNo) return;
    setDisableBtn(true);
    try {
      const res = await axios({
        method: 'PUT',
        url: '/update-status',
        withCredentials: true,
        headers: {
          Authorization: authHeader()
        },
        data: {
          id: props.order._id
        }
      })
      if (res.data.success) {
        props.updateOrderStatus(props.order._id);
        toast('Status updated!')
        setDisableBtn(false);
      }
      else {
        toast(res.data.message);
        setDisableBtn(false);
      }
    }
    catch (err) {
      if (err.response.status === 401) {
        toast(err.response.data.message);
        setDisableBtn(false);
        signOutUser();
      }
    }
  }

  return (
    <div className=''>
      <div className='flex gap-x-2 text-sm mb-4 ps-2 pt-2 text-amber-900 underline hover:cursor-pointer' onClick={() => { props.backToOrders() }}>
        <FaArrowLeft className='my-auto' />
        <span className='my-auto'>Back to Orders</span>
      </div>
      <div className='p-5 border border-gray-200'>
        <div>
          <span className='mr-4 '>Products Ordered : </span>
          <div className='products my-3'>
            {props.order.products.map((product, index) => (
              <div key={index} className='my-5 flex flex-row align-middle'>
                <div className='mr-5 my-auto'>
                  <img src={product.productImage} alt='couldnt load' className='w-20 h-20 ' />
                </div>
                <div className='flex flex-col justify-center text-sm sm:text-base'>
                  <h2 className='font-bold text-black'>Product Name</h2>
                  <div className='flex flex-col sm:flex-row'>
                    <span className='text-gray-500 '>Size : {product.size}</span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
        <div className='flex relative flex-col my-3'>
          <span className='mr-4 '>Shipping Details : </span>
          <div className='text-gray-600 flex flex-col pl-4 pt-2'>
            <span>Name : {props.order.buyerName}</span>
            <span>Phone Number : {props.order.buyerNumber}</span>
            <span>Address : {props.order.buyerAddress}</span>
          </div>
        </div>
        <div className='flex relative flex-col my-3'>
          <span className='mr-4'>Amount</span>
          <div className='text-gray-600 flex flex-col pl-4'>
            {/* <span className='text-green-700'>Paid</span> */}
            <span>
              To be Paid : &#x20B9; {props.order.totalAmount}
              {props.order.status === 3 &&
                <span className='bg-green-100 text-green-700 p-2 ms-2 rounded-lg'>Paid</span>
              }
            </span>
          </div>
        </div>
        <div className='my-6 flex gap-x-2 relative'>
          <span className='my-auto'>Status : </span>
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
            <div className='absolute left-20 xl:static text-green-600 flex gap-x-2'>
              <FaCircleCheck className='my-auto' />
              <span className='my-auto'>Delivered</span>
            </div>
          }
        </div>
        {props.order.status !== 3 &&
          <div className='text-right'>
            {props.order.status !== 2 &&
              <button onClick={updateStatus} className={`${disableBtn && 'button-loading'} bg-slate-200 text-slate-600 py-2 px-4 rounded-lg h-10 w-40 text-center`}>
                {disableBtn ? '' : 'Update Status'}
              </button>
            }
          </div>
        }
      </div>
    </div>
  )
}

export default ProcessOrder