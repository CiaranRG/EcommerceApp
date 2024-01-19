import './ContactUs.scss'
import { Link } from 'react-router-dom'

// Importing Our Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareFacebook } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faMobileScreen } from '@fortawesome/free-solid-svg-icons';

export default function ContactUs(){
    return(
        <>
        <main className="contactUsMainContent">
            <section className='contactUsHeadings'>
                <h1>Contact Us</h1>
                <p>Feel free to use the contact information below to get in touch with so we can answer any questions you may have.</p>
            </section>
            <section className='contactUsLinks'>
                <div className='contactUsItem'>
                    <p><FontAwesomeIcon icon={faEnvelope}/> Email</p>
                    <Link to={'/'}>
                        <a href="">ZenithClothes@Email.com</a>
                    </Link>
                </div>
                <div className='contactUsItem'>
                    <p ><FontAwesomeIcon icon={faTwitter}/> Twitter</p>
                    <Link to={'/'}>
                        <a href="">@ZenithClothing</a>
                    </Link>
                </div>
                <div className='contactUsItem'>
                    <p><FontAwesomeIcon icon={faSquareFacebook}/> Facebook</p>
                    <Link to={'/'}>
                        <a href="">OurFacebook</a>
                    </Link>
                </div>
                <div className='contactUsItem'>
                    <p ><FontAwesomeIcon icon={faMobileScreen}/> Call Us</p>
                    <Link to={'/'}>
                        <a href="">+44 0800 364852</a>
                    </Link>
                </div>
            </section>
        </main>
        </>
    )
}