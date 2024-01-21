import React from 'react'
import { FaArrowLeft } from 'react-icons/fa6'

const DisAllower = (props) => {

  function cancelEdit() {
    if (props.edit) props.setEdit(false);
  }

  return (
    <>
      {props.edit && <div className='p-5 ps-2 flex space-x-2 text-amber-900 hover:cursor-pointer' onClick={cancelEdit}><FaArrowLeft className='my-auto' /><span className='my-auto'>Back to product list</span></div>}
      <div className={`text-5xl text-bold text-slate-700 text-center relative`} style={{height: '100%'}}>
        <p className={`${!props.edit && 'md:absolute md:top-1/2 md:-translate-y-1/2'}`}>
          You are <span className='text-red-700'>Not</span> verified by the Admin currently
        </p>
      </div>
    </>
  )
}

export default DisAllower