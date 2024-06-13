import React, { useEffect, useRef, useState } from 'react'
import MyNavbar from './components/MyNavbar';
import Home from './components/Home';
import Footer from './components/Footer';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Product from "./components/Product";
import Products from './components/Products';
import Cart from './components/ShoppingCart/Cart';
import UserLogin from './components/UserLogin';
import UserRegistration from './components/UserRegistration';
import BuyerDashboard from './components/BuyerDashboard/BuyerDashboard';
import SellerRegistration from './components/SellerRegistration';
import NotFound from './components/NotFound';
import SellerLogin from './components/SellerLogin';
import SellerDashboard from './components/SellerDashboard/SellerDashboard';
import AdminLogin from './components/AdminPanel/AdminLogin';
import AdminDashboard from './components/AdminPanel/AdminDashboard';
import { useIsAuthenticated, useAuthUser } from 'react-auth-kit';
import { ToastContainer, Slide } from 'react-toastify';
import axios from 'axios';
import MyModal from './components/MyModal';

function App() {

  const [signedIn, setSignedIn] = useState({
    flag: false
  });
  const [cart, setCart] = useState([]);

  const isAuthenticated = useIsAuthenticated();

  const auth = useAuthUser();
  const user = auth();

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      if (isAuthenticated()) {
        setSignedInUser(true, user, user.role)
      }
      else {
        setSignedInUser(false, {});
      }
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
    else {
      firstRender.current = false;
      return;
    }
  }, [isAuthenticated, user])

  function setSignedInUser(bool, user, role) {
    setSignedIn({ ...user, flag: bool, role: role }
    )
  }

  function removeCartProduct(id) {
    setCart(prev => {
      const updatedCart = prev.filter(product => product.productId !== id);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    })
  }

  function emptyCart() {
    localStorage.removeItem('cart');
    setCart([]);
  }

  const [modal, setModal] = useState(false);
  const [modalDetails, setModalDetails] = useState();

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
    }
    else {
      document.body.style.overflow = 'visible';
    }
  }, [modal])

  const showModal = async (username) => {
    setModal(true);
    try {
      const sellerDetails = await axios({
        method: 'GET',
        url: '/seller-info/' + username,
      })
      if (sellerDetails) {
        setModalDetails(sellerDetails.data)
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const hideModal = () => setModal(false);

  const hideModalOnBodyClick = (e) => {
    if (!document.getElementById('my-modal').contains(e.target)) setModal(false);
  }

  return (
    <>
      <MyModal
        open={modal}
        modalDetails={modalDetails}
        hideModalOnBodyClick={hideModalOnBodyClick}
        sellerDetails={modalDetails}
        hideModal={hideModal}
      />

      <Router>
        <MyNavbar cartLength={cart.length} signedIn={signedIn} setUserState={setSignedInUser} />
        <Routes>
          <Route exact path="/" element={<Home signedIn={signedIn} cart={cart} />} />
          <Route path="/product" element={<Product updateCart={setCart} modalOpener={showModal} />} />
          <Route path="/products" element={<Products cart={cart} />} />
          <Route path="/cart" element={<Cart cart={cart} removeCartProduct={removeCartProduct} userDetails={signedIn} emptyCart={emptyCart} />} />
          <Route path="/login" element={<UserLogin setUserState={setSignedInUser} />} />
          <Route path="/register" element={<UserRegistration setUserState={setSignedInUser} />} />
          <Route path="/dashboard" element={<BuyerDashboard signedIn={signedIn} setUserState={setSignedInUser} modalOpener={showModal} />} />
          <Route path="/seller-registration" element={<SellerRegistration setUserState={setSignedInUser} />} />
          <Route path="/seller-login" element={<SellerLogin setUserState={setSignedInUser} />} />
          <Route path="/:username/dashboard" element={<SellerDashboard signedIn={signedIn} setUserState={setSignedInUser} />} />
          <Route path="/admin" element={<AdminLogin setUserState={setSignedInUser} />} />
          <Route path="/admin/dashboard" element={<AdminDashboard setUserState={setSignedInUser} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        transition={Slide}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />
    </>
  )
}

export default App;
