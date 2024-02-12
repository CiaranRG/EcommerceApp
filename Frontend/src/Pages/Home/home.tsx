import './home.scss'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <>
            <main className="homeMainContent">
                <section className='homeSectionOne'>
                    {/* <div className='saleNowBanner'>
                    <h1 className='saleNowText'>SALE NOW ON!</h1>
                </div> */}
                    <div className='sectionOneContent'>
                        <div className='shopNowBannerDiv'>
                            <div className='shopNowBanner'>
                                <Link to={'/newCollection'}>
                                    <a>Newest Collection!</a>
                                </Link>
                            </div>
                        </div>
                        <div className='sectionOneCards'>
                            <div className='sectionOneItemOne'>
                                <Link to={'/bestSellers'}>
                                    <a>Best Seller</a>
                                </Link>
                            </div>
                            <div className='sectionOneContactUs'>
                                <Link to={'/contactUs'}>
                                    <a>Contact Us</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='homeSectionTwo'>
                    <div className='sectionTwoContent'>
                        <h1>Shoes</h1>
                        <div className='shoesButtons'>
                            <a href='/mens/shoes' className='getShoesButton'>Mens</a>
                            <a href='/womens/shoes' className='getShoesButton'>Womens</a>
                            <a href='/kids/shoes' className='getShoesButton'>Kids</a>
                        </div>
                    </div>
                </section>
                <section className='homeSectionThree'>
                    <div className='sectionThreeContent'>
                        <h1>Up To 50% Off</h1>
                        <a href='/shoes' className='checkoutSalesButton'>Checkout Sales!</a>
                    </div>
                </section>
            </main>
        </>
    )
}