import React, { useEffect, useRef, useState } from 'react'
import { useAuthHeader, useIsAuthenticated, useSignOut } from 'react-auth-kit';
import Banner from '../Banner';
import AllUsers from './AllBuyers';
import AllSellers from './AllSellers';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import AdminProducts from './AdminProducts';

const AdminDashboard = (props) => {

  const [activeTab, setActiveTab] = useState('sellers');
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState({ tab: false, products: [], sellerId: {} });

  async function showProducts(id) {
    try {
      const products = await axios({
        method: 'GET',
        url: '/get-seller-products/' + id,
        withCredentials: true,
        headers: {
          Authorization: authHeader()
        }
      })
      const reStructuredProducts = products.data.map(product => ({ ...product, productImage: product.productImage.url }));
      setProducts({
        tab: true,
        products: reStructuredProducts,
        sellerId: sellers.find(seller => seller._id === id)._id
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  const navigate = useNavigate();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated()();

  const signOut = useSignOut();

  function handleTabClick(tabname) {
    setActiveTab(tabname);
  }

  // Will run on first render only
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      if (!isAuthenticated) {
        toast('Login as Admin First!');
        navigate('/');
      }
      else {
        axios({
          method: 'GET',
          url: '/get-sellers',
          withCredentials: true,
          headers: {
            authorization: authHeader(),
          }
        })
          .then((res) => {
            if (!res.data.valid) {
              toast("Unauthorized!");
              navigate('/');
            }
            else {
              const reStructuredSellers = res.data.sellers.map(seller => ({ ...seller, profileImage: seller.profileImage.url }))
              setSellers(reStructuredSellers);
              toast('Welcome! Affan');
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              toast("Invalid Token! Please login agian");
              signOut();
              props.setUserState(false, {}, 'visitor');
              navigate('/');
            }
          })
      }
      firstRender.current = false;
    }
    else {
      return;
    }
  }, [authHeader, isAuthenticated, navigate, signOut, props])

  function hideProducts() {
    setProducts(prev => ({ ...prev, tab: false }))
  }

  async function changeSellerVerification(id, verification) {
    try {
      const result = await axios({
        method: 'PUT',
        url: '/verify-seller/' + id,
        withCredentials: true,
        headers: {
          Authorization: authHeader()
        },
        data: {
          verified: verification
        }
      })
      if (result.data.valid) {
        verification ? toast('Seller Verified') : toast('Seller Unverified');
        setSellers(prev => prev.map(seller => {
          if (seller._id === id) return { ...seller, verified: verification }
          else return seller;
        }))
        if (!verification) {
          setProducts(prev => ({
            tab: prev.tab,
            products: prev.products.map(product => ({...product, verified: false}))
          }))
        }
      }
    }
    catch (err) {
      if (err.response.status === 401) {
        toast("Invalid Token! Please login agian");
        signOut();
        props.setUserState(false, {}, 'visitor');
        navigate('/');
      }
    }
  }

  async function changeProductVerification(id, verification, sellerId) {
    try {
      const data = {
        verified: verification,
        sellerId: sellerId
      }

      const result = await axios({
        method: 'PUT',
        url: '/verify-product/' + id,
        withCredentials: true,
        headers: {
          Authorization: authHeader()
        },
        data: data
      })
      if (result.data.valid) {
        verification ? toast('Product Verified') : toast('Product Unverified');
        setProducts(prev => (
          {
            ...prev,
            products: prev.products.map(product => {
              if (product._id === id) return { ...product, verified: verification };
              else return product;
            })
          }
        ))
        return true;
      }
      else {
        toast(result.data.message);
        return false;
      }
    }
    catch (error) {
      if (error.response.status === 401) {
        toast("Invalid Token! Please login agian");
        signOut();
        props.setUserState(false, {}, 'visitor');
        navigate('/');
      }
    }
  }

  return (
    <section className=''>
      <Banner background="bg-gray-100" textColor="text-gray-600" text="Admin Dashboard" />

      <div className='px-5 md:px-10 my-20 grid grid-flow-row grid-cols-1 md:grid-cols-4 gap-0 md:gap-6 gap-y-10'>

        <div>
          <div className='p-3 rounded shadow-lg md:sticky md:top-10'>
            <h3 className='text-2xl font-bold text-amber-900'>My Details</h3>
            <div className='my-5'>
              <div className='my-1'>
                <li className={`${(activeTab === 'sellers') ? 'border-amber-900 text-amber-900' : 'border-white text-gray-900'} border-l-2 list-none cursor-pointer`} onClick={() => handleTabClick('sellers')}>
                  <span className='pl-2 box-border'>Sellers</span>
                </li>
              </div>
              <div className='my-1'>
                <li className={`${(activeTab === 'users') ? 'border-amber-900 text-amber-900' : 'border-white text-gray-900'} border-l-2 list-none cursor-pointer`} onClick={() => handleTabClick('users')}>
                  <span className='pl-2 box-border'>Users</span>
                </li>
              </div>
            </div>
          </div>
        </div>

        <div className='col-span-3'>

          {activeTab === 'users' && (
            <AllUsers />
          )}
          {activeTab === 'sellers' && (
            products.tab
              ?
              <AdminProducts products={products.products} returnToSellers={hideProducts} productVerificationChange={changeProductVerification} sellerId={products.sellerId} />
              :
              <AllSellers sellers={sellers} showProducts={showProducts} changeVerification={changeSellerVerification} />
          )}

        </div>

      </div>
    </section>
  )
}

export default AdminDashboard;