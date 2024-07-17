import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Importing Pages
import Home from './Pages/Home/home';
import ContactUs from './Pages/ContactUs/ContactUs';
import Login from './Pages/Account/Login/Login';
import MyAccount from './Pages/Account/MyAccount/MyAccount';
import Register from './Pages/Account/Register/Register';
import Demographics from './Pages/Shop/Demographic/Demographic';
import Categories from './Pages/Shop/Categories/Categories';
import ErrorPage from './Pages/Error/ErrorPage';
import CategoryPage from './Pages/Shop/CategoryPage/CategoryPage';
import ProductDisplay from './Pages/Shop/ProductDisplay/ProductDisplay';
import CartPage from './Pages/Shop/CartPage/CartPage';
import Footer from './Footer/Footer';
import Navbar from './Navbar/Navbar';

// Load your Stripe public key
const stripePromise = loadStripe('pk_test_51PctN92NZYpAKSJyW05YhMQodsjOuWVqhteXFlITHFXaaFhzIsPsZNd0evn3aMM4boe43CH2qrlbb78ezYOHt30c00gz9JgojE');


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/accounts/logout', { withCredentials: true });
      setIsLoggedIn(false);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const loginCheck = async () => {
      try {
        const response = await axios('http://localhost:5000/accounts/isLoggedIn', { method: 'GET', withCredentials: true });
        if (response.data.isLoggedIn) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.log(err);
        }
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    loginCheck();
  }, []);

  if (loading) {
    return <div></div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/contactUs' element={<ContactUs />} />
          <Route path='/shop' element={<Demographics />} />
          <Route path='/shop/:demographic/categories' element={<Categories />} />
          <Route path='/shop/:demographic/:category' element={<CategoryPage />} />
          <Route path='/shop/:demographic/:category/product/:id' element={<ProductDisplay isLoggedIn={isLoggedIn} />} />
          <Route path='/account' element={isLoggedIn ? <MyAccount /> : <Navigate to="/login" />} />
          <Route path='/login' element={isLoggedIn ? <Navigate to="/account" /> : <Login onLogin={handleLogin} />} />
          <Route path='/register' element={isLoggedIn ? <Navigate to="/account" /> : <Register />} />
          <Route path='/error' element={<ErrorPage errorCode='' errorMessage='' />} />
          <Route path='/cart' element={<CartPage isLoggedIn={isLoggedIn} />} />
          <Route path='*' element={<ErrorPage errorCode='404' errorMessage='Page not found!' />} />
        </Routes>
        <Footer />
      </Router>
    </Elements>
  );
}

export default App;
