import React, { useEffect, useRef, useState } from 'react';
import Banner from '../Banner';
import CartProduct from './CartProduct';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthHeader, useIsAuthenticated, useSignOut } from 'react-auth-kit';
import { FaCircleExclamation } from 'react-icons/fa6';
import axios from 'axios';
import { toast } from 'react-toastify';

const Cart = (props) => {

  let [diffSellers, setDiffSellers] = useState(false);
  let [disableBtn, setDisableBtn] = useState(false);

  const navigate = useNavigate();
  function navigateToDashboard() {
    navigate("/dashboard");
  }

  const isAuthenticated = useIsAuthenticated()();
  const authHeader = useAuthHeader();

  const signOut = useSignOut();
  function signOutUser() {
    signOut();
    props.setUserState(false, {}, 'visitor');
    navigate('/seller-login');
  }

  function removeCartProduct(id) {
    props.removeCartProduct(id);
  }

  const totalRef = useRef();
  useEffect(() => {
    let total = 0;
    props.cart.forEach(product => {
      total += parseInt(product.price);
    })
    totalRef.current.innerHTML = `&#x20B9;${total}`;

    setDiffSellers(false);
    props.cart.forEach((product, index) => {
      if (index !== props.cart.length - 1 && product.sellerId !== props.cart[index + 1].sellerId) setDiffSellers(true);
    })
  }, [props.cart])

  const bookProducts = async () => {
    setDisableBtn(true);
    try {
      const res = await axios({
        method: 'POST',
        url: '/order',
        withCredentials: true,
        headers: {
          Authorization: authHeader()
        },
        data: props.cart
      })
      if (res?.data.success) {
        toast('Order placed!');
        props.emptyCart();
        setDisableBtn(false);
        navigate('/dashboard', { state: { orderSuccess: true } });
      }
    }
    catch (err) {
      console.log(err);
      setDisableBtn(false);
      if (err.response.status === 401) {
        toast(err.response.data.message);
        signOutUser();
      }
    }
  }

  return (
    <section id='cart'>
      <Banner background='bg-gray-100' textColor='text-gray-800' text='Shopping Cart' />

      {/* <div className='cart-banner bg-gray-100 flex justify-center align-middle'>
        <h1 className='font-bold text-3xl md:text-5xl text-amber-900 my-16'></h1>
      </div> */}

      <div className='my-20 px-5 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-5'>
        <div className='products col-span-1 md:col-span-2'>

          <div className='shadow-[0_0px_2px_rgba(0,0,0,0.25)] p-5'>
            {isAuthenticated ?
              props.userDetails.role === 'buyer' ?
                <div>
                  <div className='text-xl font-bold'>{props.userDetails.username}</div>
                  <div className='my-auto text-gray-600'>Mobile No : +91 {props.userDetails.phoneNumber}</div>
                  <div className='my-2 text-gray-600'>Address : {props.userDetails.address}</div>
                  <div className='text-right'>
                    <button onClick={navigateToDashboard} className='bg-gray-200 hover:bg-gray-30 bg-green-3000 text-amber-900 py-2 px-4 rounded-lg'>Edit</button>
                  </div>
                </div>
                :
                <div className='text-center'>
                  <FaCircleExclamation className='inline mr-2 text-red-700' />Logout and Login as buyer
                </div>
              :
              <div className='flex justify-center gap-x-2'>
                <FaCircleExclamation className='my-auto text-red-700' />
                <span className='my-auto text-red-700'>Not Signed in</span>
              </div>
            }
          </div>
          {diffSellers &&
            <div className='p-5 mt-2 bg-emerald-50 border border-green-300 flex gap-x-2 justify-center'>
              <FaCircleExclamation className='my-auto text-green-600' />
              <span className='my-auto'>Products will be delivered separately by different sellers.</span>
            </div>
          }

          {props.cart.map((cart, index) => (
            <CartProduct
              key={index}
              id={cart.productId}
              productImage={cart.image}
              name={cart.name}
              brand={cart.brand}
              seller={cart.sellerName}
              size={cart.size}
              price={cart.price}
              removeCartProduct={removeCartProduct}
            />
          ))}

        </div>
        <div className='checkout'>
          <div className='shadow-2xl rounded-md p-5'>
            <div className=''>
              <h1 className='text-3xl font-bold text-amber-900'>Order Details</h1>
            </div>
            <div className='my-5 text-gray-700'>
              {props.cart.map((cart, index) => (
                <div key={index} className='grid grid-cols-2'>
                  <span>{cart.name}</span>
                  <span className='text-right'>&#x20B9;{cart.price}</span>
                </div>
              ))}
            </div>
            <div className='my-5 grid grid-cols-2 font-bold text-2xl'>
              <span>Total</span>
              <span ref={totalRef} className='text-right'></span>
            </div>
            {isAuthenticated ?
              props.userDetails.role === 'buyer' ?
                <div className=''>
                  {props.cart.length !== 0 &&
                    <button className={`${disableBtn && 'button-loading'} h-12 bg-amber-900 text-white  w-full rounded-md`} onClick={bookProducts} disabled={disableBtn}>
                      {disableBtn ? '' : 'Book Products'}
                    </button>
                  }
                </div>
                :
                <div className='text-center'>
                  <FaCircleExclamation className='inline mr-2 text-red-700' />Logout and Login as buyer
                </div>
              :
              <div className='flex justify-center gap-x-2'>
                <FaCircleExclamation className='my-auto text-red-700' />
                <Link to={'/login'}>
                  <span className='my-auto underline'>Click here to sign in</span>
                </Link>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cart