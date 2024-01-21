/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Card from './Card';
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import BigLoader from './BigLoader';


const FeaturedProducts = (props) => {

  return (
    <div id={props.id} className='product-section px-5 pt-5 md:px-10 my-10 bg-white'>
      <div className='flex justify-between'>
        <h1 className='text-2xl sm:text-4xl text-amber-900 font-bold'>Best Selling</h1>
        <Link to={'/products'} className='my-auto text-amber-900 flex align-middle sm:justify-center' href=''>
          <span className='my-auto mr-2'><FaArrowRight /></span>
          <span className='my-auto'>View More</span>
        </Link>
      </div>
      <hr className='mt-2 border border-gray-200' />
      {!props.productsLoading
        ?
        <div className='card-container mt-5 mb-10 grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {
            props.products.map((product, index) => (
              <Card key={index} product={product} cart={props.cart} />
            ))
          }
        </div>
        :
        <div className='my-5 py-5'>
          <BigLoader />
        </div>
      }
    </div>
  )
}

export default FeaturedProducts;