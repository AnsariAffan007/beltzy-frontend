import React from 'react'
import { FaArrowRight, FaCircleExclamation, FaTrash, FaPen, FaCircleCheck, FaWarehouse } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Card = (props) => {

  function removeElement() {
    props.deleteProduct(props.product);
  }

  function setUpdateProductTab() {
    props.setUpdateProductTab(props.product);
  }

  return (
    <div className='product shadow-lg rounded-lg pb-5 flex flex-col justify-between relative'>

      {/* {props.product.stock === 0
        ?
        <div className='p-2 text-right bg-white border-red-700 border-2 absolute top-0 right-0 rounded-lg'>
          <div className='text-red-700 text-sm flex gap-x-2'>
            <span className='my-auto'><FaWarehouse /></span>
            <span className='my-auto'>Out of Stock</span>
          </div>
        </div>
        :
        <div className='p-2 text-right bg-white border-red-700 border-2 absolute top-0 right-0 rounded-lg'>
          <div className='text-red-700 text-sm flex gap-x-2'>
            <span className='my-auto'><FaWarehouse /></span>
            <span className='my-auto'>Out of Stock</span>
          </div>
        </div>
      } */}

      <img src={props.product.productImage} alt="coultn'd load" className='rounded-lg' loading='lazy' />
      <div className='mt-4'>
        <div className='px-5 mb-2 flex justify-between '>
          <span className='product-name my-auto text-xl flex gap-x-2'>
            {props.product.name}
            {props.cart && props.cart.some(product => product.productId === props.product._id) &&
              <span className='rounded-lg text-green-600 flex px-2 gap-x-1 text-sm'>
                <FaCircleCheck className='my-auto' />
                <span className='my-auto'>Cart</span>
              </span>
            }
          </span>
          {props.sellerProduct ?
            <span className={`${props.product.verified ? 'text-green-600' : 'text-red-700'} py-1 px-3 rounded-md flex space-x-1`}>
              {!props.product.verified ? <FaCircleExclamation className='my-auto' /> : <FaCircleCheck className='my-auto' />}
              <span className='my-auto'>{!props.product.verified && 'Not'} Verified</span>
            </span>
            :
            <div>
              {props.product.stock === 0
                ?
                <div className='p-2 text-right bg-white rounded-lg'>
                  <div className='text-red-700 text-sm flex gap-x-2'>
                    <span className='my-auto'><FaWarehouse /></span>
                    <span className='my-auto'>Out of Stock</span>
                  </div>
                </div>
                :
                <div className='p-2 text-right bg-white rounded-lg'>
                  <div className='text-green-700 text-sm flex gap-x-2'>
                    <span className='my-auto'><FaWarehouse /></span>
                    <span className='my-auto'>In Stock</span>
                  </div>
                </div>
              }
            </div>
          }
        </div>
        <div className='px-5 mb-7 flex justify-between'>
          <span className='my-auto text-amber-900 py-1 rounded-md text-2xl font-bold'>&#x20B9; {props.product.price}</span>
          {props.sellerProduct ?
            <span className='my-auto py-1 px-3 bg-gray-100 rounded-lg'>{props.product.brand}</span>
            :
            <span className='my-auto text-amber-900 py-1 px-3 bg-gray-100 rounded-lg'>{props.product.sellerName}</span>
          }
        </div>
        <div className={`px-5 grid grid-cols-1 ${props.sellerProduct && 'md:grid-cols-2'} gap-3`}>
          {props.sellerProduct ?
            <Link onClick={removeElement} className='p-2 bg-gray-200 text-amber-900 rounded-md hover:bg-gray-300 flex justify-center scale-animation'>
              <span className='my-auto mr-2'><FaTrash /></span>
              <span className='my-auto'>Remove</span>
            </Link>
            :
            <Link to="/product" state={props.product} className='p-2 bg-amber-900 text-white rounded-md hover:bg-amber-700 flex justify-center scale-animation'>
              <span className='my-auto mr-2'><FaArrowRight /></span>
              <span className='my-auto'>View</span>
            </Link>
          }
          {props.sellerProduct &&
            <Link onClick={setUpdateProductTab} className='p-2 bg-amber-900 hover:bg-amber-800 text-white rounded-md flex justify-center scale-animation'>
              <span className='my-auto mr-2'><FaPen /></span>
              <span className='my-auto'>Edit</span>
            </Link>
          }
        </div>
      </div>
    </div>
  )
}

export default Card