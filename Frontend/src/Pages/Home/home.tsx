import './home.scss'

export default function Home(){
    return(
        <>
        <main className="homeMainContent">
            <section className='homeSectionOne'>
                <div className='saleNowBanner'>
                    <h1 className='saleNowText'>SALE NOW ON!</h1>
                </div>
                <div className='sectionOneContent'>
                    <div className='shopNowBannerDiv'>
                        <div className='shopNowBanner'>
                            <h1>Newest Collection!</h1>
                        </div>
                    </div>
                    <div className='sectionOneCards'>
                        <div className='sectionOneItemOne'>
                            <h1>Best Sellers!</h1>
                        </div>
                        <div className='sectionOneItemTwo'>
                            <h1>Clearance!</h1>
                        </div>
                    </div>
                </div>
            </section>
            <section className='homeSectionTwo'>
                <div className='sectionTwoContent'>
                    <h1>Shoes</h1>
                    <div className='shoesButtons'>
                        <a href='/shoes' className='getShoesButton'>Mens</a>
                        <a href='/shoes' className='getShoesButton'>Womens</a>
                        <a href='/shoes' className='getShoesButton'>Kids</a>
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