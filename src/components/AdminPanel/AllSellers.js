import React from 'react'
import Seller from './Seller'

const AllSellers = (props) => {

  function showProducts(id) {
    props.showProducts(id);
  }

  function changeVerification(id, verification) {
    props.changeVerification(id, verification);
  }

  return (
    <section id='users-container' className='grid gap-4 grid-cols-1 lg:grid-cols-2'>
      {props.sellers.map((seller, index) => (
        <Seller key={index} seller={seller} showProducts={showProducts} changeVerification={changeVerification} />
      ))}
    </section>
  )
}

export default AllSellers