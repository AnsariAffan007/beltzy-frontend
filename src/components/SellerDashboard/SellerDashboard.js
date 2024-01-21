import React, { useCallback, useEffect, useRef, useState } from 'react'
import Banner from '../Banner';
import { useNavigate, useParams } from 'react-router-dom';
import Details from './Details';
import SellerProducts from './SellerProducts';
import UploadProduct from './UploadProduct';
import SellerOrders from './SellerOrders';
import { useAuthHeader, useIsAuthenticated, useSignOut } from 'react-auth-kit';
import axios from 'axios'
import { toast } from 'react-toastify';
import DisAllower from './DisAllower';

const SellerDashboard = (props) => {

  const [sellerImage, setSellerImage] = useState({ link: false, file: false, image: '' });
  const [products, setProducts] = useState([]);
  function addProduct(product) {
    setProducts(prev => [...prev, product]);
  }
  function removeProduct(id) {
    setProducts(prev => prev.filter(product => product._id !== id));
  }

  const [orders, setOrders] = useState([]);
  const updateStatus = (id) => {
    setOrders(prev => (
      prev.map(order => (order._id === id ? { ...order, status: order.status + 1 } : order))
    ))
  }
  const [activeTab, setActiveTab] = useState('details');
  const [editProduct, setEditProduct] = useState(
    {
      edit: false,
      product: {
        name: '',
        description: '',
        brand: '',
        price: '',
        stock: '',
        sizes: []
      }
    });
  function setEdit(bool) {
    setEditProduct((prev) => ({
      edit: bool,
      product: prev.product
    }));
  }

  const { username } = useParams();
  const navigate = useNavigate();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated()();

  const signOut = useSignOut();
  const signOutUser = useCallback(() => {
    signOut();
    props.setUserState(false, {}, 'visitor');
    navigate('/seller-login');
  }, [navigate, props, signOut])

  const fetchProducts = useCallback(async () => {
    try {
      const products = await axios({
        method: 'GET',
        url: '/get-products',
        withCredentials: true,
        headers: {
          Authorization: authHeader(),
        }
      })
      const reStructuredProducts = products.data.map(product => ({ ...product, productImage: product.productImage.url }))
      setProducts(reStructuredProducts);
    }
    catch (error) {
      if (error.response.status === 401) {
        toast(error.response.data.message);
        signOutUser();
      }
    }
  }, [authHeader, signOutUser])

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/seller-orders',
        withCredentials: true,
        headers: {
          Authorization: authHeader(),
        }
      })
      setOrders(res.data);
    }
    catch (err) {
      if (err.response.status === 401) {
        toast(err.response.data.message);
        signOutUser();
      }
    }
  }, [authHeader, signOutUser])

  // Will run on first render only
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      if (!isAuthenticated) {
        toast('Please Login as Seller first or make a seller account !');
        navigate('/seller-login')
      }
      else {
        fetchProducts();
        fetchOrders();
      }
    }
  }, [navigate, isAuthenticated, fetchProducts, fetchOrders]);

  useEffect(() => {
    setSellerImage({ file: false, link: true, image: props.signedIn.profileImage });
  }, [props.signedIn])

  function deleteProduct(product) {
    product.sellerId = props.signedIn._id;
    let deleteProduct = window.confirm('Delete this product permanently ?');
    if (!deleteProduct) return;
    const id = product._id;
    axios({
      method: 'delete',
      url: `/delete-product/${id}`,
      withCredentials: true,
      headers: {
        Authorization: authHeader()
      },
      data: product
    }).then(res => {
      toast('Product deleted successfully!')
      removeProduct(id);
    }).catch(err => {
      if (err.response.status === 403) toast(err.response.data.message);
      else {
        toast(err.response.data.message);
        props.signOutUser();
      }
    });
  };

  function setUpdateProductTab(product) {
    setEditProduct({ edit: true, product: product });
  }

  function updateProductState(product) {
    setProducts((prev) => {
      let newProducts = prev.map(item => {
        if (item._id === product._id) return product;
        else return item;
      })
      return newProducts;
    })
  }

  function handleTabClick(tabname) {
    setActiveTab(tabname)
  }

  function setProfilePic(options) {
    setSellerImage(options);
  }

  return (
    <section id='dashboard'>

      <Banner background='bg-gray-200' textColor='text-gray-900' text={`Welcome, ${username}!`} />

      <div className='px-5 md:px-10 my-20 grid grid-flow-row grid-cols-1 md:grid-cols-4 gap-0 md:gap-6 gap-y-10'>

        <div>
          <div className='p-3 rounded shadow-lg md:sticky md:top-10'>
            <h3 className='text-2xl font-bold text-amber-900'>My Details</h3>
            <div className='my-5'>
              <div className='my-1'>
                <li className={`${(activeTab === 'details') ? 'border-amber-900 text-amber-900' : 'border-white text-gray-900'} border-l-2 list-none cursor-pointer`} onClick={() => handleTabClick('details')}>
                  <span className='pl-2 box-border'>Accout Details</span>
                </li>
              </div>
              <div className='my-1'>
                <li className={`${(activeTab === 'products') ? 'border-amber-900 text-amber-900' : 'border-white text-gray-900'} border-l-2 list-none cursor-pointer`} onClick={() => handleTabClick('products')}>
                  <span className='pl-2 box-border'>All Products</span>
                </li>
              </div>
              <div className='my-1'>
                <li className={`${(activeTab === 'upload') ? 'border-amber-900 text-amber-900' : 'border-white text-gray-900'} border-l-2 list-none cursor-pointer`} onClick={() => handleTabClick('upload')}>
                  <span className='pl-2 box-border'>Upload Product</span>
                </li>
              </div>
              <div className='my-1'>
                <li className={`${(activeTab === 'orders') ? 'border-amber-900 text-amber-900' : 'border-white text-gray-900'} border-l-2 list-none cursor-pointer`} onClick={() => handleTabClick('orders')}>
                  <span className='pl-2 box-border'>Orders</span>
                </li>
              </div>
            </div>
          </div>
        </div>

        <div className='col-span-3'>

          {activeTab === 'details' && (
            <Details
              profilePic={sellerImage}
              setProfilePic={setProfilePic}
              userDetails={props.signedIn}
              setUserState={props.setUserState}
            />
          )}
          {(activeTab === 'products') &&
            (
              editProduct.edit
                ?
                props.signedIn.verified
                  ?
                  <UploadProduct
                    getAuthHeader={authHeader}
                    signOutUser={signOutUser}
                    signedIn={props.signedIn}
                    edit={true}
                    setEdit={setEdit}
                    product={editProduct.product}
                    updateProductState={updateProductState}
                  />
                  :
                  <DisAllower edit={true} setEdit={setEdit} />
                :
                <SellerProducts
                  products={products}
                  deleteProduct={deleteProduct}
                  signOutUser={signOutUser}
                  setUpdateProductTab={setUpdateProductTab}
                />
            )
          }
          {activeTab === 'upload' && (
            props.signedIn.verified
              ?
              <UploadProduct
                getAuthHeader={authHeader}
                signedIn={props.signedIn}
                signOutUser={signOutUser}
                changeTab={handleTabClick}
                addProduct={addProduct}
              />
              :
              <DisAllower />
          )}
          {activeTab === 'orders' && (
            <SellerOrders updateOrderStatus={updateStatus} orders={orders} />
          )}
        </div>


      </div>
    </section>
  )
}

export default SellerDashboard