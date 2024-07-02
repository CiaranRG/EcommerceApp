import './Footer.scss'
import { Link } from 'react-router-dom'

export default function Footer() {

    return (
        <>
            <div className="footer">
                <Link to={'/contactUs'}>
                    <a>Feel free to contact us by clicking here!</a>
                </Link>
            </div>
        </>
    )
}