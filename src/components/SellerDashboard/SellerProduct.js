import React from 'react'

const SellerProduct = (props) => {

  // function changeToEditTab() {
  //   props.onEdit();
  // }

  return (
    <div className='flex flex-col lg:flex-row  bg-gray-100 rounded-lg pb-4 lg:pb-0'>
      <div><img src='../images/belt6.jpg' alt='couldnt load' className='rounded-lg h-32 w-32' /></div>
      <div className='mx-2 my-1 lg:mx-4 lg:my-auto text-xl font-bold text-amber-900'>Belt Name</div>
      <div className='mx-2 my-1 lg:mx-4 lg:my-auto text-gray-500'>Belt Brand</div>
      <div className='mx-2 my-1 lg:mx-4 lg:my-auto'>Leather</div>
      <div className='mx-2 my-1 lg:mx-4 lg:my-auto text-xl font-bold text-amber-900'>&#x20B9; 500</div>
      <div className='ml-2 lg:ml-auto lg:my-auto pr-0 lg:pr-4'>
        <button className='mr-4 bg-gray-300 p-2 rounded-lg'>Remove</button>
        <button className='bg-amber-800 p-2 text-white rounded-lg'>Edit</button>
      </div>
    </div>
  )
}

export default SellerProduct