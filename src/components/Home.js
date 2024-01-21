import React, { useCallback, useEffect, useState } from 'react'
import Lander from './Lander'
import FeaturedProducts from './FeaturedProducts'
import axios from 'axios';

const Home = (props) => {

  const [bestSelling, setBestSelling] = useState([]);
  // const [topRated, setTopRated] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const fetchBestSelling = useCallback(async () => {
    try {
      setProductsLoading(true);
      const products = await axios({
        method: 'GET',
        url: '/best-selling',
        withCredentials: true
      })
      if (products) {
        const reStructured = products.data.map(product => ({ ...product, productImage: product.productImage.url }));
        setBestSelling(reStructured);
        setProductsLoading(false)
      }
    }
    catch (err) {
      setProductsLoading(false);
      console.log(err);
    }
  }, [])

  useEffect(() => {
    fetchBestSelling();
  }, [fetchBestSelling])

  // const fetchTopRated = useCallback(async () => {

  // })

  return (
    <>
      <Lander user={props.signedIn} />
      <FeaturedProducts id="start" products={bestSelling} productsLoading={productsLoading} cart={props.cart} />
      {/* <FeaturedProducts /> */}
      {bestSelling.length === 0 && !productsLoading
        &&
        <div className='text-center text-4xl text-slate-700 mb-20'>There are no products to be sold currently.</div>
      }
    </>
  )
}

export default Home