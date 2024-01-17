import './App.scss'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Home from './Pages/Home/home'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'

function App() {

  return (
    <Router>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
        </Routes>
        <Footer/>
    </Router>
  )
}

export default App
