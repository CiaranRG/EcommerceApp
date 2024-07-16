import { useState, useEffect } from 'react'
import axios from 'axios'
import './CartPage.scss'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom'

import Product from '../Product/Product';

// Convert this to being a .env import instead of plain text

interface Product {
    id: number;
    name: string;
    price: string;
    stock: number;
    description: string;
    imageurl: string;
    quantity: number;
    productid: number;
}



export default function CartPage({ isLoggedIn }: { isLoggedIn: boolean }) {
    const [cart, setCart] = useState<Product[]>([])
    const [userAddress, setUserAddress] = useState({ addressLine1: '', addressLine2: '', city: '', state: '', postal_code: '', country: '', phone_number: '' })
    const [isProcessing, setIsProcessing] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

    const totalCost = (cart: Product[]) => {
        let total = 0
        for (let i = 0; i < cart.length; i++) {
            let currNum = parseInt(cart[i].price)
            total = total + currNum
        }
        return total;
    }
    // Function for checking the amount of items in the cart
    const totalItems = (cart: Product[]) => {
        let total = 0;
        for (let i = 0; i < cart.length; i++) {
            total = total + cart[i].quantity;
        }
        return total;
    }

    const handleAddressChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = evt.target;
        setUserAddress((prevData) => ({ ...prevData, [name]: value }))
    }

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

    useEffect(() => {
        const gatherCartItems = async () => {
            try {
                const result = await axios.get('http://localhost:5000/cart', { withCredentials: true })
                setCart(result.data.data)
            } catch (err) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(err)
                }
            }
        }
        gatherCartItems()
    }, [])

    const handleItemRemove = async (productId: number) => {
        try {
            const result = await axios.post('http://localhost:5000/cart/remove', { productId: productId }, { withCredentials: true })
            alert(`${result.data.message}`)
            window.location.reload();
        } catch (err) {

        }
    }

    // function to clear the cart if the transaction is succesful 
    const handleSuccessfulCheckout = () => {
        // Update to also clear the cart in the database
        setCart([]);
    };

    const handlePaymentSubmit = async (evt: React.FormEvent) => {
        console.log('Inside handle payment')
        evt.preventDefault()
        setIsProcessing(true)
        // If nothing was returned by stripe to fill these variables then instantly return
        if (!stripe || !elements) {
            console.log('No stripe or elements')
            setIsProcessing(false)
            return;
        }
        try {
            console.log('Entering try catch')
            // sending a request to the backend see we know how much the user has to pay, the data we get back contains a clientSecret that stripe creates specifically for each payment
            const { data } = await axios.post('http://localhost:5000/cart/payment', { totalAmount: totalCost(cart) }, { withCredentials: true });
            // We then check if the user has paid using that clientSecret we got from stripe on the backend
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                },
            });
            console.log('passed result')
            console.log(result)
            // If an error was returned by our payment check then alert the user
            if (result.error) {
                console.error('Payment failed', result.error.message);
                alert('Payment failed: ' + result.error.message);
            } else {
                console.log('Inside payment success')
                // If it was a success then proceed to make the order in the database by querying the backend endpoint
                if (result.paymentIntent?.status === 'succeeded') {
                    alert('Payment successful!');
                    await axios.post('http://localhost:5000/orders/create', { totalAmount: totalCost(cart) }, { withCredentials: true });
                    alert('Order created successfully!');
                    handleSuccessfulCheckout();
                }
            }
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Error processing payment');
                console.log(err);
            }
            alert('Error processing payment');
        }
        setIsProcessing(false);
    }

    return (
        <>{isLoggedIn ?
            <div className="checkoutMainContent">
                <div className="cartShowcase">
                    <div className="carousel">
                        {cart.map((product, index) => (
                            <div className="cartItem" key={index}>
                                <div className="cartItemDetails">
                                    <img src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                    <p>{product.name}</p>
                                    <p>${product.price}</p>
                                    <p>Cart: {product.quantity}</p>
                                    <button className='removeItemBtn' onClick={() => handleItemRemove(product.productid)}>Remove Item</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="cartShippingAddress">
                    <form action="" onSubmit={handlePaymentSubmit}>
                        {/* Using a grid setup for the form instead of flex */}
                        <label htmlFor="addressLineOne" className='shippingLineOneLabel'>Address Line 1</label>
                        <input type="text" placeholder='Address Line 1' id='addressLine1' name='addressLine1' value={userAddress.addressLine1} onChange={handleAddressChange} autoComplete='address-line1' required />
                        <label htmlFor="" className='shippingLineTwoLabel'>Address Line 2</label>
                        <input type="text" placeholder='Address Line 2' id='addressLine2' name='addressLine2' value={userAddress.addressLine2} onChange={handleAddressChange} autoComplete='address-line2' required />
                        <label htmlFor="" className='shippingCityLabel'>City</label>
                        <input type="text" placeholder='City' id='city' name='city' value={userAddress.city} onChange={handleAddressChange} autoComplete='address-level2' required />
                        <label htmlFor="">State</label>
                        <input type="text" placeholder='State ' id='state' name='state' value={userAddress.state} onChange={handleAddressChange} className='shippingStateLabel' autoComplete='state' required />
                        <label htmlFor="">Post Code</label>
                        <input type="text" placeholder='Post Code' id='postal_code' name='postal_code' value={userAddress.postal_code} onChange={handleAddressChange} className='shippingPostCodeLabel' autoComplete='postal-code' required />
                        <label htmlFor="" className='shippingCountryLabel'>Country</label>
                        <select name="country" id="country" onChange={handleAddressChange} value={userAddress.country} autoComplete="country" required >
                            <option value="">Choose a country!</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United States">United States</option>
                            <option value="Italy">Italy</option>
                            <option value="Germany">Germany</option>
                        </select>
                        <label htmlFor="" className='shippingPhoneNumberLabel'>Phone Number</label>
                        <input type="tel" placeholder='Phone Number' id='phone_number' name='phone_number' value={userAddress.phone_number} onChange={handleAddressChange} autoComplete='tel' required />
                        <div className="paymentSection">
                            <label htmlFor="cardElement">Payment Information</label>
                            <CardElement id="cardElement" />
                        </div>
                        <p className='totalItems'> {totalItems(cart)} Items in your cart</p>
                        <p className='totalCost'> Total amount is ${totalCost(cart)}</p>
                        <div className="cartBtns">
                            <Link to={'/'}>Go Home</Link>
                            <button type="submit" disabled={isProcessing}>{isProcessing ? 'Processing…' : 'Checkout'}</button>
                        </div>
                    </form>
                </div>
            </div>
            :
            <>
                <div className="CheckoutMainContent">
                    <h1>Login to checkout</h1>
                </div>
            </>}
        </>
    )
}

