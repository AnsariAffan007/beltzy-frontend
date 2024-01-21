/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { useSignOut } from 'react-auth-kit';
import { FaBars, FaXmark, FaCartShopping, FaUser, FaArrowRightFromBracket, FaArrowRight } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

const MyNavbar = (props) => {

  const [toggled, setToggled] = useState(false);
  const navigate = useNavigate();
  function toggleNav() {
    setToggled(prev => !prev);
  }

  const signOut = useSignOut();
  function signOutUser() {
    signOut();
    props.setUserState(false, {}, 'visitor');
    toast('Logout Successful !')
    navigate('/');
  }

  return (
    <>
      <nav id='nav' className={`px-5 md:px-10 py-6 flex justify-between bg-amber-100 relative z-50`}>
        <h1 className='navbrand text-2xl font-bold text-amber-900 my-auto'>
          <Link to="/" className='flex gap-x-2 home-link-rotator'>
            <span className=''>
              <img src='images/icons8-buckle-48.png' alt='could not load' className='home-belt-icon w-8 h-8 rotate-45' />
            </span>
            <span>BeltZWorld</span>
          </Link>
        </h1>
        <ul className="hidden px-5 pb-2 md:p-0 w-full md:w-auto bg-amber-100 md:static md:flex align-middle my-auto">
          <li className='my-3 md:ml-5 md:my-auto text-amber-700 underline-animation'>
            <Link to="/products">All Products</Link>
          </li>
          <li className='my-3 md:ml-5 md:my-auto text-amber-700 underline-animation'>
            <Link to='/seller-registration'>Become a Seller</Link>
          </li>
          <li className='my-3 md:ml-5 md:my-auto text-amber-700 underline-animation'>About</li>
          <li className='my-3 md:ml-5 md:my-auto text-white flex'>
            <Link to="/cart" className='flex align-middle'>
              <button className='h-10 mr-2 text-2xl my-auto text-amber-900 rounded-md pr-3 flex gap-x-1 scale-animation'>
                {props.cartLength !== 0 && <span className='my-auto text-md'>{props.cartLength}</span>}
                <FaCartShopping className='my-auto' />
              </button>
            </Link>
            {(props.signedIn.flag && (props.signedIn.role === 'seller')) && (
              <Link to={`${props.signedIn.username}/dashboard`} className='my-auto'>
                <button className='flex align-middle gap-2 h-10 mr-2 bg-amber-900 hover:bg-amber-800 py-2 rounded-md px-3 scale-animation'>
                  <span>{props.signedIn.username}</span>
                  <span className='my-auto'><FaArrowRight /></span>
                </button>
              </Link>
            )}
            {(props.signedIn.flag && (props.signedIn.role === 'buyer')) && (
              <Link to={`/dashboard`} className='my-auto'>
                <button className='flex align-middle gap-2 h-10 mr-2 bg-amber-900 hover:bg-amber-800 py-2 rounded-md px-3 scale-animation'>
                  <span>{props.signedIn.username}</span>
                  <span className='my-auto'><FaArrowRight /></span>
                </button>
              </Link>
            )}
            {props.signedIn.flag && (
              <button onClick={signOutUser} className='h-10 mr-2 bg-amber-900 hover:bg-amber-800 py-2 rounded-md px-3 scale-animation'>
                <span className='my-auto'><FaArrowRightFromBracket /></span>
              </button>
            )}
            {!props.signedIn.flag && (
              <Link to='/login' className='my-auto'>
                <button className='h-10 bg-amber-900 hover:bg-amber-800 p-1.5 rounded-md px-3 scale-animation'>
                  Sign in
                </button>
              </Link>
            )}

          </li>
        </ul>
        {toggled
          ? <button className='text-2xl md:hidden text-amber-900' onClick={toggleNav}><FaXmark /></button>
          : <button className='text-2xl md:hidden text-amber-900' onClick={toggleNav}><FaBars /></button>
        }
      </nav>
      <ul className={`${toggled ? 'top-20' : '-top-21'} absolute left-0 text-right transition-all linear duration-700 px-5 pb-2 w-full md:hidden bg-amber-100 my-auto border-b-2 border-amber-900`}>
        <li onClick={toggleNav} href='#' className='my-3 text-amber-700 hover:text-amber-900'>
          <Link to="/products">
            All Products
          </Link>
        </li>
        <li onClick={toggleNav} href='#' className='my-3 text-amber-700 hover:text-amber-900'>
          <Link to='/seller-registration'>
            Become a Seller
          </Link>
        </li>
        <li onClick={toggleNav} href='#' className='my-3 text-amber-700 hover:text-amber-900'>About</li>
        <li onClick={toggleNav} href='#' className='my-3 text-white flex justify-end'>
          <Link to="/cart">
            <button className='h-10 mr-2 bg-amber-900 hover:bg-amber-800 py-2 rounded-md px-3 flex gap-x-1'>
              {props.cartLength !== 0 && <span className='my-auto'>{props.cartLength}</span>}
              <FaCartShopping className='my-auto' />
            </button>
          </Link>
          {props.signedIn.flag && (
            <Link to="/dashboard">
              <button className='h-10 mr-2 bg-amber-900 hover:bg-amber-800 py-2 rounded-md px-3'>
                <FaUser />
              </button>
            </Link>
          )}
          {!props.signedIn.flag && (
            <Link to='/login'>
              <button className='h-10 bg-amber-900 hover:bg-amber-800 p-1.5 rounded-md px-3'>
                Sign in
              </button>
            </Link>
          )}
          {props.signedIn.flag && (
            <Link className='my-auto'>
              <button onClick={signOutUser} className='h-10 bg-amber-900 hover:bg-amber-800 py-2 rounded-md px-3'>
                <span className='my-auto'><FaArrowRightFromBracket /></span>
              </button>
            </Link>
          )}
        </li>
      </ul>
    </>
  )
}

export default MyNavbar;