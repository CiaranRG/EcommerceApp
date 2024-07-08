import { useState } from 'react'
import './CheckoutPage.scss'
import { Link } from 'react-router-dom'

interface Product {
    name: string,
    price: number,
    stock: number,
    description: string,
    imageurl: string,
}

export default function CheckoutPage() {
    const [cart, setCart] = useState<Product>({ name: '', price: 0, stock: 0, description: '', imageurl: '' })

    return (
        <>
            <div className="checkoutMainContent">
                <div className="cartShowcase">
                    <p>Cart Showcase Carousel</p>
                </div>
                <div className="cartShippingAddress">
                    <form action="">
                        {/* Using a grid setup for the form instead of flex */}
                        <label htmlFor="addressLineOne" className='shippingLineOneLabel'>Address Line 1</label>
                        <input type="text" placeholder='Address Line 1' id='addressLine1' name='addressLine1' autoComplete='address-line1' />
                        <label htmlFor="" className='shippingLineTwoLabel'>Address Line 2</label>
                        <input type="text" placeholder='Address Line 2' id='addressLine2' name='addressLine2' autoComplete='address-line2' />
                        <label htmlFor="" className='shippingCityLabel'>City</label>
                        <input type="text" placeholder='City' id='city' name='city' autoComplete='address-level2' />
                        <label htmlFor="">State</label>
                        <input type="text" placeholder='State ' id='state' name='state' className='shippingStateLabel' autoComplete='state' />
                        <label htmlFor="">Post Code</label>
                        <input type="text" placeholder='Post Code' id='postal_code' name='postal_code' className='shippingPostCodeLabel' autoComplete='postal-code' />
                        <label htmlFor="" className='shippingCountryLabel'>Country</label>
                        <select name="country" id="country" autoComplete="country">
                            <option value="">Choose a country!</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United States">United States</option>
                            <option value="Italy">Italy</option>
                            <option value="Germany">Germany</option>
                        </select>
                        <label htmlFor="" className='shippingPhoneNumberLabel'>Phone Number</label>
                        <input type="tel" placeholder='Phone Number' id='phone_number' name='phone_number' autoComplete='tel' />
                        <div className="cartBtns">
                            {/* <Link to={'/'}>Go Back</Link> */}
                            <Link to={'/'}>Go Back</Link>
                            <button>Checkout</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}