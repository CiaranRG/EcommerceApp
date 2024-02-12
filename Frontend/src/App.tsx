import './App.scss'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useState } from 'react'

// Importing Pages
import Home from './Pages/Home/home'
import ContactUs from './Pages/ContactUs/ContactUs'
import Login from './Pages/Account/Login/Login'
import MyAccount from './Pages/Account/MyAccount/MyAccount'
import Register from './Pages/Account/Register/Register'
import Cart from './Pages/Account/Cart/Cart'
import Demographics from './Pages/Shop/Demographic/Demographic'
import Categories from './Pages/Shop/Categories/Categories'

// Importing Components
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    try {
      setIsLoggedIn(false);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contactUs' element={<ContactUs />} />
        <Route path='/shop' element={<Demographics />} />
        <Route path='/:demographic/categories' element={<Categories />} />
        {/* Using isLoggedIn to check the logged in status and then using the navigate component to redirect if needed */}
        <Route path='/account' element={isLoggedIn ? <MyAccount /> : <Navigate to="/login" />} />
        <Route path='/cart' element={isLoggedIn ? <Cart /> : <Navigate to="/login" />} />
        <Route path='/login' element={isLoggedIn ? <Navigate to="/account" /> : <Login />} />
        <Route path='/register' element={isLoggedIn ? <Navigate to="/account" /> : <Register />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
