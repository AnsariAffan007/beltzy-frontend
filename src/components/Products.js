import React, { useEffect, useRef, useState } from 'react'
import Card from './Card'
import { AiOutlineRedo } from "react-icons/ai";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Banner from './Banner';
import axios from 'axios';
import { toast } from 'react-toastify';
import BigLoader from './BigLoader';

const Products = (props) => {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      fetchProducts();
      firstRender.current = false;
    }
  }, []);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const res = await axios({
        method: 'GET',
        url: '/products',
        withCredentials: true
      })
      const reStructuredProducts = res.data.map(product => ({ ...product, productImage: product.productImage.url }));
      setProducts(reStructuredProducts);
      setFilteredProducts(reStructuredProducts);
      setProductsLoading(false);
    }
    catch (err) {
      console.log(err);
      setProductsLoading(false);
    }
  }

  const [priceFilterValue, setPriceFilterValue] = useState('');
  const checkValue = (e) => {
    if (e.target.value.length > 5 || parseInt(e.target.value) > 10000) {
      toast('Max price is ₹10,000 only', { toastId: 'no-dups-bro' })
    }
    else setPriceFilterValue(e.target.value)
  }

  const [sizeFilter, setSizeFilter] = useState([]);
  const changeSizeFilter = (e) => {
    setSizeFilter((prev) => {
      if (e.target.checked) return [...prev, e.target.value]
      else return prev.filter(size => size !== e.target.value);
    })
  }

  const applyFilter = () => {
    if (priceFilterValue || sizeFilter.length !== 0) {
      setFilteredProducts((prev) => {
        prev = products;
        if (sizeFilter.length !== 0) {
          prev = products.filter(product => {
            return sizeFilter.some(val => product.sizes.includes(parseInt(val)));
          })
        }
        if (priceFilterValue) {
          prev = prev.filter(product => {
            return parseInt(product.price) <= parseInt(priceFilterValue)
          })
        }
        return prev
      })
    }
    else {
      toast('Apply some filters first!', { toastId: 'no-dups-bro' })
    }
  }

  const resetFilters = () => {
    setPriceFilterValue('');
    setSizeFilter([]);
    setFilteredProducts(products);
  }

  const searchByTerm = (e) => {
    let searchTerm = e.target.value.toLowerCase();
    let products = document.querySelectorAll('.product');
    products.forEach(prod => {
      if (!prod.querySelector('.product-name').textContent.toLowerCase().includes(searchTerm)) prod.style.display = 'none';
      else prod.style.display = 'flex';
    })
  }

  return (
    <section id='products' className=''>

      <Banner background='banner' textColor='text-amber-100' text='Tommy Hilfiger' />

      <div id='' className='h-fit px-5 md:px-10 my-20 grid grid-flow-row grid-cols-1 md:grid-cols-4 gap-0 md:gap-6 gap-y-10'>
        {/* Filters */}
        <div>
          <div className='p-3 rounded border border-slate-300'>
            <h3 className='text-xl font-bold text-amber-900'>Filters</h3>
            <div id='filtration-sidebar'>
              <div className='my-4'>
                <h4 className='text-gray-800 font-medium my-2'>Price</h4>
                <div className='bg-slate-100 rounded p-2 flex text-sm '>
                  <span className='text-gray-400 mr-2'>Up to &#x20B9;</span>
                  <div className='flex-1'>
                    <input
                      type='number'
                      className='bg-transparent focus:outline-none flex-1 w-full'
                      value={priceFilterValue}
                      onChange={checkValue}
                    />
                  </div>
                </div>
              </div>

              <div className='my-4'>
                <h4 className='text-gray-800 font-medium mb-2'>Size</h4>
                <div>
                  <ul className='text-gray-400 text-sm'>
                    <li>
                      <input type='checkbox' name='size' id='28' value={28} onChange={changeSizeFilter} checked={sizeFilter.includes('28')} />
                      <label className='ml-2' htmlFor="28">28</label>
                    </li>
                    <li>
                      <input type='checkbox' name='size' id='32' value={32} onChange={changeSizeFilter} checked={sizeFilter.includes('32')} />
                      <label className='ml-2' htmlFor="32">32</label>
                    </li>
                    <li>
                      <input type='checkbox' name='size' id='36' value={36} onChange={changeSizeFilter} checked={sizeFilter.includes('36')} />
                      <label className='ml-2' htmlFor="36">36</label>
                    </li>
                    <li>
                      <input type='checkbox' name='size' id='40' value={40} onChange={changeSizeFilter} checked={sizeFilter.includes('40')} />
                      <label className='ml-2' htmlFor="40">40</label>
                    </li>
                    <li>
                      <input type='checkbox' name='size' id='44' value={44} onChange={changeSizeFilter} checked={sizeFilter.includes('44')} />
                      <label className='ml-2' htmlFor="44">44</label>
                    </li>
                  </ul>
                </div>
              </div>

              <div className='my-4 grid grid-cols-4 gap-2'>
                <button className='my-auto col-span-3 bg-amber-900 text-white rounded-md p-1 scale-animation' onClick={applyFilter}>Apply</button>
                <button className='my-auto flex justify-center bg-gray-200 text-amber-900 rounded-md p-2 scale-animation' onClick={resetFilters}>
                  <AiOutlineRedo />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Products */}
        <div className='col-span-3'>

          <div id='product-search' className='mb-10'>
            <div className='flex justify-between'>
              <input type='text' placeholder='Search' className='my-auto p-3 bg-gray-100 w-full outline-none rounded-l-lg' onChange={searchByTerm} />
              <span className='my-auto text-xl bg-amber-900 text-white p-4 rounded-r-lg'><FaMagnifyingGlass /></span>
            </div>
          </div>

          {!productsLoading ?
            <div className='grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5' id='products-container'>
              {
                filteredProducts.map((product, index) => (
                  <Card key={index} product={product} cart={props.cart} />
                ))
              }
            </div>
            :
            <BigLoader />
          }
          {products.length === 0 && !productsLoading
            &&
            <div className='text-center text-4xl text-slate-700'>There are no products to be sold currently.</div>
          }

        </div>
      </div>
    </section>
  )
}

export default Products