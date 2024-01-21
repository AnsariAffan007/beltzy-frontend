/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef } from 'react'
import { FaArrowLeft, FaCircleExclamation } from 'react-icons/fa6';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

const Product = (props) => {

  let { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state]);

  let sizeRef = useRef();

  function addToCart() {
    if (sizeRef.current.value === '') {
      toast('Select the size you want!', {toastId: 'no dups'})
      return;
    }
    const cartProduct = {
      productId: state._id,
      name: state.name,
      brand: state.brand,
      sellerName: state.sellerName,
      sellerId: state.sellerId,
      image: state.productImage,
      size: sizeRef.current.value,
      price: state.price
    }
    props.updateCart(prev => {
      const updatedCart = [...prev, cartProduct];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    })
    toast('Item added in cart');
    navigate('/cart');
  }

  return (
    <section id='product' className='px-5 md:px-10 py-6'>
      <div className='lg:flex my-10'>
        <div className='images mt-5 md:mx-auto flex flex-col justify-end md:justify-start w-full md:w-1/2 sm:px-10 '>
          <img src={state.productImage} alt='Coulndt Load' className='mx-auto  relative z-[-2] md:z-0' />
        </div>

        <div className='md:p-0 lg:pl-10 lg:w-1/2 flex flex-col justify-start'>
          <div className='mt-5'>
            <Link to={'/products'} className='flex gap-x-2 text-amber-700 underline text-sm'>
              <FaArrowLeft className='my-auto' />
              <span className='my-auto'>Products</span>
            </Link>
          </div>
          <div className='mt-5 flex'>
            <h1 className='my-auto mr-3 text-2xl inline'>{state.name}</h1>
            {/* <span className='my-auto bg-slate-100 text-slate-700 rounded-md px-2'>&#9733; 4.5</span> */}
          </div>

          <hr className='my-4 border-gray-300' />

          <div className='mb-1 relative'>
            <span className='text-gray-500'>Seller : </span>
            <span className='text-slate-700 absolute left-24'>{state.sellerName} <span className='underline text-amber-900 text-sm hover:cursor-pointer' onClick={() => props.modalOpener(state.sellerName)}>(Details)</span></span>
          </div>
          <div className='my-1 relative'>
            <span className='text-gray-500'>Brand : </span>
            <span className='text-slate-700 absolute left-24'>{state.brand}</span>
          </div>
          <div className='my-1 relative'>
            <span className='text-gray-500'>Sold : </span>
            {state.sold === 0 ?
              <span className='text-green-600 absolute left-24'>Be the first to own this product!</span>
              :
              <span className='text-slate-700 absolute left-24'>
                {state.sold} Unit{state.sold !== 1 && 's'}
              </span>
            }
          </div>

          <hr className='border-gray-300 mt-4' />

          <div className='my-5 font-bold text-2xl text-amber-900'>&#x20B9; {state.price}/-</div>

          <hr className='border-gray-300 mb-4' />

          <div>
            <p className='mb-2'>Description : -</p>
            <span className='text-gray-600'>{state.description}</span>
          </div>

          <hr className='border-gray-300 mt-4' />

          {state.stock !== 0 && <div className='my-5 flex relative text-sm sm:text-base'>
            <span className='mr-5 my-auto'>Sizes :</span>
            <div className='inline my-auto text-sm'>
              <select defaultValue={''} ref={sizeRef} className='py-1 px-6  bg-slate-200 rounded-xl focus:outline-none'>
                <option disabled hidden value={''}>Size</option>
                {state.sizes.sort().map((size, index) => (
                  <option key={index} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>}

          <div>
            {state.stock !== 0 ?
              <button className='py-2 px-4 w-full border border-amber-900 text-amber-900 rounded-md hover:bg-amber-900 hover:text-white transition-all duration-200' onClick={addToCart}>
                Add to Cart
              </button>
              :
              <div className='text-red-700 my-5 flex gap-x-2 text-lg'>
                <span className='my-auto'>
                  <FaCircleExclamation />
                </span>
                <span className='my-auto'>
                  This product is currently out of stock. Contact seller for more information.
                </span>
              </div>
            }
          </div>

        </div>
      </div>

      {/* <h3 className='mt-10 pb-2 border-b border-gray-200 text-2xl'>Reviews</h3>

      <div id='review-container' className='my-6 grid gap-y-8'>
        <div className='review text-sm sm:text-base'>
          <p className='flex gap-x-2 mb-1'>
            <FaCircleUser className='text-slate-300 my-auto text-3xl' />
            <span className='my-auto'>Ansari Affan</span>
          </p>
          <p className='font-bold flex gap-x-1 my-2'>
            <span className='my-auto flex gap-x-1'><FaStar className='my-auto text-amber-700' />4.5 -</span>
            <span className='my-auto'>Best budget belt in this price range from this seller</span>
          </p>
          <p>I took this keyboard after so much research and going through so much reviews. The keyboard is heavy and sturdy, as soon as you pick this up in hands you can feel this. The rgb lighting is good, it is quite good and bright but the patterns of lightning is the area I can't comment right now.</p>
        </div>
        <div className='review text-sm sm:text-base'>
          <p className='flex gap-x-2 mb-1'>
            <FaCircleUser className='text-slate-300 my-auto text-3xl' />
            <span className='my-auto'>Ansari Affan</span>
          </p>
          <p className='font-bold flex gap-x-1 my-2'>
            <span className='my-auto flex gap-x-1'><FaStar className='my-auto text-amber-700' />4.5 -</span>
            <span className='my-auto'>Best budget belt in this price range from this seller</span>
          </p>
          <p>I took this keyboard after so much research and going through so much reviews. The keyboard is heavy and sturdy, as soon as you pick this up in hands you can feel this. The rgb lighting is good, it is quite good and bright but the patterns of lightning is the area I can't comment right now.</p>
        </div>
      </div> */}

    </section>
  )
}

export default Product;