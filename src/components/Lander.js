import React from 'react'
import { Link } from 'react-router-dom';

const Lander = (props) => {

  function scrollToStart(e) {
    const section = document.getElementById('start');
    section.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <section id='lander' className='flex-col-reverse md:flex-row flex justify-center md:justify-between align-middle pt-12 px-5 md:px-10 bg-amber-100'>
        <div className='md:w-2/4 mb-20 md:mb-0 text-center md:text-left'>
          <h1 className='font-bold text-4xl md:text-6xl text-amber-900 md:mt-40 mb-10'>Where Comfort and Style Meet</h1>
          <div className='flex flex-col sm:flex-row justify-center md:justify-start'>
            <button onClick={scrollToStart} className='my-auto border-solid border-2 border-amber-900 rounded-md p-2 text-amber-900 hover:bg-amber-900 hover:text-white px-4 mr-0 mb-4 sm:mr-4 sm:mb-0 scale-animation'>Featured Products
            </button>
            {(props.user.flag && props.user.role === 'seller') && (
              <Link to={`/${props.user.username}/dashboard`}>
                <button className='w-full h-full my-auto rounded-md p-2 bg-amber-900 text-white hover:bg-amber-800 px-0 sm:px-10 scale-animation'>Dashboard</button>
              </Link>
            )}
            {(props.user.flag && props.user.role === 'buyer') && (
              <Link to={`/dashboard`}>
                <button className='w-full h-full my-auto rounded-md p-2 bg-amber-900 text-white hover:bg-amber-800 px-0 sm:px-10 scale-animation'>Dashboard</button>
              </Link>
            )}
            {(!props.user.flag) && (
              <Link to='/seller-login'>
                <button className='w-full h-full my-auto rounded-md p-2 bg-amber-900 text-white hover:bg-amber-800 px-0 sm:px-10 scale-animation'>Seller Login</button>
              </Link>
            )}
          </div>
        </div>
        <div className='w-3/4 md:w-2/4 flex mb-10 mx-auto md:m-auto'>
          <img src='images/home-bg.png' alt="couldn't load" className='m-auto w-full md:w-auto' />
        </div>
      </section>
    </>
  )
}

export default Lander;