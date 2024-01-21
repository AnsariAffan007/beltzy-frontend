import React from 'react'
import { FaTrash, FaArrowRight } from 'react-icons/fa6'

const User = () => {
  return (
    <div className='user p-3 border border-gray-300 rounded-lg'>
      <h2 className='text-xl font-bold'>Affan Ansari</h2>
      <div className='text-gray-600'>+91 9833084160</div>
      <div className='text-gray-600 text-sm my-2'>Email : ansariaffan014@gmail.com</div>
      <div className='text-gray-600 flex justify-between'>
        <button className='text-red-900'><FaTrash /></button>
        <button className='ml-2 text-green-700'><FaArrowRight /></button>
      </div>
    </div>
  )
}

export default User