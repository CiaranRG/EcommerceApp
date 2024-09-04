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
                            <Link to={'/shop/mens/shoes'} className='getShoesButton'>Mens</Link>
                            <Link to={'/shop/womens/shoes'} className='getShoesButton'>Womens</Link>
                            <Link to={'/shop/kids/shoes'} className='getShoesButton'>Kids</Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}