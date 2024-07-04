import './App.scss'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

// Importing Pages
import Home from './Pages/Home/home'
import ContactUs from './Pages/ContactUs/ContactUs'
import Login from './Pages/Account/Login/Login'
import MyAccount from './Pages/Account/MyAccount/MyAccount'
import Register from './Pages/Account/Register/Register'
import Cart from './Pages/Account/Cart/Cart'
import Demographics from './Pages/Shop/Demographic/Demographic'
import Categories from './Pages/Shop/Categories/Categories'
import ErrorPage from './Pages/Error/ErrorPage'

// Importing Components
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'
import CategoryPage from './Pages/Shop/CategoryPage/CategoryPage'
import ProductDisplay from './Pages/Shop/ProductDisplay/ProductDisplay'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/accounts/logout', { withCredentials: true })
      setIsLoggedIn(false);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    const loginCheck = async () => {
      try {
        const response = await axios('http://localhost:5000/accounts/isLoggedIn', { method: 'GET', withCredentials: true })
        if (response.data.isLoggedIn) {
          setIsLoggedIn(true)
        } else {
          setIsLoggedIn(false)
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.log(err)
        }
        setIsLoggedIn(false)
      }
    };
    // Call the function 
    loginCheck();
  }, [])

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contactUs' element={<ContactUs />} />
        <Route path='/shop' element={<Demographics />} />
        <Route path='/shop/:demographic/categories' element={<Categories />} />
        <Route path='/shop/:demographic/:category' element={<CategoryPage />} />
        <Route path='/shop/:demographic/:category/product/:id' element={<ProductDisplay />} />
        {/* Using isLoggedIn to check the logged in status and then using the navigate component to redirect if needed */}
        <Route path='/account' element={isLoggedIn ? <MyAccount /> : <Navigate to="/login" />} />
        <Route path='/cart' element={isLoggedIn ? <Cart /> : <Navigate to="/login" />} />
        <Route path='/login' element={isLoggedIn ? <Navigate to="/account" /> : <Login onLogin={handleLogin} />} />
        <Route path='/register' element={isLoggedIn ? <Navigate to="/account" /> : <Register />} />
        <Route path='/error' element={<ErrorPage errorCode='' errorMessage='' />} />
        <Route path='*' element={<ErrorPage errorCode='404' errorMessage='Page not found!' />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
