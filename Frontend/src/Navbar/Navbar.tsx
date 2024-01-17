import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './Navbar.scss'

export default function Navbar(){
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    return (
        <>
            <nav className="navbar">
                <div className="topNav">
                    <div className="topLeftNav">
                        <h1 className="brandName">ZENITH</h1>
                    </div>
                    <div className="topRightNav">
                        <form action="" className="searchForm">
                            <input type="text" className="navSearch" placeholder="Search" />
                            <button type="button" className="searchButton">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </form>
                    </div>
                </div>
                <div className="bottomNav">
                    <div className="bottomNavContent">
                        <a href="">HOME</a>
                        <a href="">SHOP</a>
                        <a href="">CONTACT</a>
                        <a href="">CART</a>
                    </div>
                </div>
            </nav>
        </>
    )
}