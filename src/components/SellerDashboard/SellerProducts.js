import React from 'react'
import Card from '../Card';
import BigLoader from '../BigLoader';

const SellerProducts = (props) => {

  function deleteProduct(product) {
    props.deleteProduct(product)
  }

  function setUpdateProductTab(product) {
    props.setUpdateProductTab(product);
  }

  return (

    <div>
      {props.products
        ?
        <div className='grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
          {props.products.map((product, index) => {
            return (
              <Card
                key={index}
                sellerProduct={true}
                product={product}
                deleteProduct={deleteProduct}
                setUpdateProductTab={setUpdateProductTab}
              />
            )
          })}
        </div>
        :
        <BigLoader />
      }
    </div>


  )
}

export default SellerProducts