import React from 'react'

const CartProduct = (props) => {

  function removeFromCart() {
    props.removeCartProduct(props.id)
  }

  return (
    <div className='flex flex-col sm:flex-row align-middle my-10 shadow-lg py-2'>
      <div className='sm:mr-5 my-auto mx-auto sm:mx-0'>
        <img src={props.productImage} alt='couldnt load' className='w-36 h-36 ' />
      </div>
      <div className='my-auto mx-4 sm:mx-0 sm:me-4 py-4 sm:py-0 flex justify-between flex-1'>
        <div>
          <h2 className='text-xl font-bold'>{props.name}</h2>
          <div className='text-gray-700'>Size : {props.size}</div>
          <div className='text-gray-700'>Brand : {props.brand}</div>
          <div className='text-gray-700'>Seller : {props.seller}</div>
        </div>
        <div className='text-right'>
          <p className='text-2xl'>&#x20B9;{props.price}</p>
          <p className='text-amber-900 underline hover:cursor-pointer text-right' onClick={removeFromCart}>Remove</p>
        </div>
      </div>
    </div>
  )
}

export default CartProduct