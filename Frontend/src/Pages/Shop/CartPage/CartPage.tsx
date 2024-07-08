import { useState, useEffect } from 'react'
import axios from 'axios'
import './CartPage.scss'
import { Link } from 'react-router-dom'

interface Product {
    name: string,
    price: number,
    stock: number,
    description: string,
    imageurl: string,
    totalItems: number,
    totalCost: number,
}

export default function CartPage() {
    const [cart, setCart] = useState<Product>({ name: '', price: 0, stock: 0, description: '', imageurl: '', totalItems: 0, totalCost: 0 })
    const [userAddress, setUserAddress] = useState({ addressLine1: '', addressLine2: '', city: '', state: '', postal_code: '', country: '', phone_number: '' })

    useEffect(() => {
        const gatherUserData = async () => {
            try {
                const result = await axios.get('http://localhost:5000/accounts', { withCredentials: true })
                // Setting the persons shipping details
                setUserAddress({
                    addressLine1: result.data.data.address_line1 || '',
                    addressLine2: result.data.data.address_line2 || '',
                    city: result.data.data.city || '',
                    state: result.data.data.state || '',
                    postal_code: result.data.data.postal_code || '',
                    country: result.data.data.country || '',
                    phone_number: result.data.data.phone_number || '',
                });
            } catch (err) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(err)
                }
            }

        }
        gatherUserData()
    }, [])

    return (
        <>
            <div className="checkoutMainContent">
                <div className="cartShowcase">
                    <div className="carousel">
                        <div className="cartItem">
                            <div className="cartItemDetails">
                                <img src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                <p>Black Shoes</p>
                                <p>$45.99</p>
                                <p>Cart: 3</p>
                                <p>Remove Item</p>
                            </div>
                        </div>
                        <div className="cartItem">
                            <div className="cartItemDetails">
                                <img src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                <p>Black Shoes</p>
                                <p>$45.99</p>
                                <p>Cart: 3</p>
                                <p>Remove Item</p>
                            </div>
                        </div>
                        <div className="cartItem">
                            <div className="cartItemDetails">
                                <img src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                <p>Black Shoes</p>
                                <p>$45.99</p>
                                <p>Cart: 3</p>
                                <p>Remove Item</p>
                            </div>
                        </div>
                        <div className="cartItem">
                            <div className="cartItemDetails">
                                <img src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                <p>Black Shoes</p>
                                <p>$45.99</p>
                                <p>Cart: 3</p>
                                <p>Remove Item</p>
                            </div>
                        </div>
                        <div className="cartItem">
                            <div className="cartItemDetails">
                                <img src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                <p>Black Shoes</p>
                                <p>$45.99</p>
                                <p>Cart: 3</p>
                                <p>Remove Item</p>
                            </div>
                        </div>
                        <div className="cartItem">
                            <div className="cartItemDetails">
                                <img src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                <p>Black Shoes</p>
                                <p>$45.99</p>
                                <p>Cart: 3</p>
                                <p>Remove Item</p>
                            </div>
                        </div>
                        <div className="cartItem">
                            <div className="cartItemDetails">
                                <img src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                <p>Black Shoes</p>
                                <p>$45.99</p>
                                <p>Cart: 3</p>
                                <p>Remove Item</p>
                            </div>
                        </div>
                        <div className="cartItem">
                            <div className="cartItemDetails">
                                <img src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                <p>Black Shoes</p>
                                <p>$45.99</p>
                                <p>Cart: 3</p>
                                <p>Remove Item</p>
                            </div>
                        </div>
                        <div className="cartItem">
                            <div className="cartItemDetails">
                                <img src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                <p>Black Shoes</p>
                                <p>$45.99</p>
                                <p>Cart: 3</p>
                                <p>Remove Item</p>
                            </div>
                        </div>
                        <div className="cartItem">
                            <div className="cartItemDetails">
                                <img src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                <p>Black Shoes</p>
                                <p>$45.99</p>
                                <p>Cart: 3</p>
                                <p>Remove Item</p>
                            </div>
                        </div>
                        <div className="cartItem">
                            <div className="cartItemDetails">
                                <img src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                <p>Black Shoes</p>
                                <p>$45.99</p>
                                <p>Cart: 3</p>
                                <p>Remove Item</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cartShippingAddress">
                    <form action="">
                        {/* Using a grid setup for the form instead of flex */}
                        <label htmlFor="addressLineOne" className='shippingLineOneLabel'>Address Line 1</label>
                        <input type="text" placeholder='Address Line 1' id='addressLine1' name='addressLine1' value={userAddress.addressLine1} autoComplete='address-line1' />
                        <label htmlFor="" className='shippingLineTwoLabel'>Address Line 2</label>
                        <input type="text" placeholder='Address Line 2' id='addressLine2' name='addressLine2' value={userAddress.addressLine2} autoComplete='address-line2' />
                        <label htmlFor="" className='shippingCityLabel'>City</label>
                        <input type="text" placeholder='City' id='city' name='city' value={userAddress.city} autoComplete='address-level2' />
                        <label htmlFor="">State</label>
                        <input type="text" placeholder='State ' id='state' name='state' value={userAddress.state} className='shippingStateLabel' autoComplete='state' />
                        <label htmlFor="">Post Code</label>
                        <input type="text" placeholder='Post Code' id='postal_code' name='postal_code' value={userAddress.postal_code} className='shippingPostCodeLabel' autoComplete='postal-code' />
                        <label htmlFor="" className='shippingCountryLabel'>Country</label>
                        <select name="country" id="country" value={userAddress.country} autoComplete="country">
                            <option value="">Choose a country!</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United States">United States</option>
                            <option value="Italy">Italy</option>
                            <option value="Germany">Germany</option>
                        </select>
                        <label htmlFor="" className='shippingPhoneNumberLabel'>Phone Number</label>
                        <input type="tel" placeholder='Phone Number' id='phone_number' name='phone_number' value={userAddress.phone_number} autoComplete='tel' />
                        <p className='totalAmountText'>{cart.totalItems} items in your cart, total cost of ${cart.totalCost}</p>
                        <div className="cartBtns">
                            <Link to={'/'}>Go Back</Link>
                            <button>Checkout</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

