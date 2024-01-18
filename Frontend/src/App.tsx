import './App.scss'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { useState } from 'react'

import Home from './Pages/Home/home'
import ContactUs from './Pages/ContactUs/ContactUs'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/contactUs' element={<ContactUs/>}/>
        </Routes>
        <Footer/>
    </Router>
  )
}

export default App
