import './home.scss'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <>
            <main className="homeMainContent">
                <section className='homeSectionOne'>
                    <div className='sectionOneContent'>
                        <div className='shopNowBannerDiv'>
                            <div className='shopNowBanner'>
                                <Link to={'/shop'}>
                                    Shop Now
                                </Link>
                            </div>
                        </div>
                        <div className='sectionOneCards'>
                            <div className='sectionOneItemOne'>
                                <Link to={'/cart'}>
                                    My Cart
                                </Link>
                            </div>
                            <div className='sectionOneContactUs'>
                                <Link to={'/contactUs'}>
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='homeSectionTwo'>
                    <div className='sectionTwoContent'>
                        <h1>Shoes</h1>
                        <div className='shoesButtons'>
                            <a href='/shop/mens/shoes' className='getShoesButton'>Mens</a>
                            <a href='/shop/womens/shoes' className='getShoesButton'>Womens</a>
                            <a href='/shop/kids/shoes' className='getShoesButton'>Kids</a>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}