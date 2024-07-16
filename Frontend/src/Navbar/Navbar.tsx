import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import './Navbar.scss'

type NavbarProps = {
    isLoggedIn?: boolean,
    onLogout?: () => void,
}

export default function Navbar({ isLoggedIn, onLogout }: NavbarProps) {


    return (
        <>
            <nav className="navbar">
                <div className="topNav">
                    <div className="topLeftNav">
                        <Link to={'/'}>
                            ZENITH
                        </Link>
                    </div>
                    <div className="topRightNav">
                        <Link to={'/cart'} className="cartBtn">
                            <FontAwesomeIcon icon={faCartShopping} className="cartIcon" />
                        </Link>
                    </div>
                </div>
                <div className="bottomNav">
                    <div className="bottomNavContent">
                        <Link to={'/'}>HOME</Link>
                        <Link to={'shop'}>
                            SHOP
                        </Link>
                        {isLoggedIn ? <Link to={'account'}>ACCOUNT</Link> : <Link to={'login'}>LOGIN</Link>}
                        {isLoggedIn ? <button onClick={onLogout} className="logoutBtn">LOGOUT</button> : <Link to={'register'}>REGISTER</Link>}
                    </div>
                </div>
                <div className='saleNowBanner'>
                    <h1 className='saleNowText'>SALE NOW ON!</h1>
                </div>
            </nav>
        </>
    )
}