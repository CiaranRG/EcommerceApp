import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './Navbar.scss'

type NavbarProps = {
    isLoggedIn?: boolean,
    onLogin: () => void,
    onLogout?: () => void,
}

export default function Navbar({ isLoggedIn, onLogin, onLogout}: NavbarProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        // No Need to destructure name and iterate over previous data as we only have one value
        const { value } = evt.target
        setSearchTerm(value)
    }

    return (
        <>
            <nav className="navbar">
                <div className="topNav">
                    <div className="topLeftNav">
                        <Link to={'/'}>
                            <a className="brandName">ZENITH</a>
                        </Link>
                    </div>
                    <div className="topRightNav">
                        <form action="" className="searchForm">
                            <input type="text" className="navSearch" name="searchTerm" placeholder="Search" value={searchTerm} onChange={handleChange} />
                            <button type="button" className="searchButton">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </form>
                    </div>
                </div>
                <div className="bottomNav">
                    <div className="bottomNavContent">
                        <Link to={'/'}>
                            <a href="/">HOME</a>
                        </Link>
                        <Link to={'shop'}>
                            <a href="shop">SHOP</a>
                        </Link>
                        {isLoggedIn ? <Link to={'account'}><a href="account">ACCOUNT</a></Link> : <Link to={'login'}><a href="login">LOGIN</a></Link>}
                        {isLoggedIn ? <Link to={'cart'}><a href="cart">CART</a></Link> : <Link to={'register'}><a href="register">REGISTER</a></Link>}
                    </div>
                </div>
                <div className='saleNowBanner'>
                    <h1 className='saleNowText'>SALE NOW ON!</h1>
                </div>
            </nav>
        </>
    )
}