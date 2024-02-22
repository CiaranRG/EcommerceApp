import './Footer.scss'
import { Link } from 'react-router-dom'

export default function Footer() {

    return (
        <>
            <div className="footer">
                <Link to={'/'}>
                    <a>Home</a>
                </Link>
                <Link to={'/contactUs'}>
                    <a>Contact Us</a>
                </Link>
            </div>
        </>
    )
}