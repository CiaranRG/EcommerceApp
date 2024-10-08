import { useState, useEffect, } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import './CartPage.scss'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Product from '../Product/Product';
import isIOS from '../../../utils/isIOS';

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

const apiUrl = import.meta.env.VITE_API_URL;

export default function CartPage({ isLoggedIn }: { isLoggedIn: boolean }) {
    const [cart, setCart] = useState<Product[]>([])
    const [userAddress, setUserAddress] = useState({ addressLine1: '', addressLine2: '', city: '', state: '', postal_code: '', country: '', phone_number: '' })
    // State to change text etc based on the current value
    const [isProcessing, setIsProcessing] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false)

    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate()

    const totalCost = (cart: Product[]) => {
        let total = 0
        for (let i = 0; i < cart.length; i++) {
            let currNum = parseInt(cart[i].price)
            total = total + currNum
        }
        if (total === 0) {
            return { string: '', total: total }
        } else {
            return { string: `total amount is $${total}`, total: total };
        }
    }
    // Function for checking the amount of items in the cart
    const totalItems = (cart: Product[]) => {
        let total = 0;
        for (let i = 0; i < cart.length; i++) {
            total = total + cart[i].quantity;
        }
        if (total === 0) {
            return { string: 'Your cart is empty', total: total }
        } else {
            return { string: `${total} items in your cart`, total: total };
        }
    }

    const handleAddressChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = evt.target;
        setUserAddress((prevData) => ({ ...prevData, [name]: value }))
    }

    useEffect(() => {
        const gatherUserData = async () => {
            try {
                let result
                if (isIOS()) {
                    const sid = localStorage.getItem('session')
                    result = await axios.post(`${apiUrl}/accounts/getDataIOS`, { session: sid });
                } else {
                    result = await axios.get(`${apiUrl}/accounts`, { withCredentials: true });
                }
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
        setCartLoading(true)
        const gatherCartItems = async () => {
            try {
                let result
                if (isIOS()) {
                    const sid = localStorage.getItem('session')
                    result = await axios.post(`${apiUrl}/cart/getDataIOS`, { session: sid })
                } else {
                    result = await axios.get(`${apiUrl}/cart`, { withCredentials: true })
                }
                setCart(result.data.data)
            } catch (err) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(err)
                }
            }
            setCartLoading(false)
        }
        gatherCartItems()
    }, [])

    const handleItemRemove = async (productId: number) => {
        try {
            setIsRemoving(true)
            if (isIOS()) {
                const sid = localStorage.getItem('session')
                await axios.post(`${apiUrl}/cart/remove`, { productId: productId, session: sid }, { withCredentials: true })
            } else {
                await axios.post(`${apiUrl}/cart/remove`, { productId: productId }, { withCredentials: true })
            }
            window.location.reload();
            setIsRemoving(false)
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.log(err)
            }
            setIsRemoving(false)
        }
    }

    // function to clear the cart if the transaction is succesful 
    const handleSuccessfulCheckout = async () => {
        // Update to also clear the cart in the database
        try {
            if (isIOS()) {
                const sid = localStorage.getItem('session')
                await axios.post(`${apiUrl}/cart/clear`, { session: sid },)
            } else {
                await axios.post(`${apiUrl}/cart/clear`, {}, { withCredentials: true })
            }
            // Navigate to the account page
            navigate('/account')
            toast.success('Order created', { position: 'top-center', hideProgressBar: true, pauseOnHover: false, draggable: true, theme: 'colored', transition: Bounce })
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.log(err)
            }
        }
    };

    const handlePaymentSubmit = async (evt: React.FormEvent) => {
        evt.preventDefault()
        setIsProcessing(true)
        // If nothing was returned by stripe to fill these variables then instantly return
        if (!stripe || !elements) {
            setIsProcessing(false)
            return;
        }
        try {
            const dataToSend = {
                addressLine1: userAddress.addressLine1,
                addressLine2: userAddress.addressLine2,
                city: userAddress.city,
                state: userAddress.state,
                postal_code: userAddress.postal_code,
                country: userAddress.country,
                phone_number: userAddress.phone_number,
                ...(isIOS() && { session: localStorage.getItem('session') })
            }
            try {
                await axios.post(`${apiUrl}/accounts/changeAddress`, dataToSend, { withCredentials: true })
            } catch (err) {
                // Checking if the error is an axios error, which would mean an error occurred at any point during the axios request
                if (axios.isAxiosError(err)) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('Handle address change error')
                    }
                    const serverResponse = err.response;
                    if (serverResponse?.status === 500) {
                        return toast.error("Internal server error, try again later!", { position: 'top-center', hideProgressBar: true, pauseOnHover: false, draggable: true, theme: 'colored', transition: Bounce });
                    } else if (serverResponse?.status === 400) {
                        return toast.error("Please enter a valid address!", { position: 'top-center', hideProgressBar: true, pauseOnHover: false, draggable: true, theme: 'colored', transition: Bounce });
                    }
                } else {
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('Handle address change error')
                        console.log(err)
                    }
                }
            }
            // sending a request to the backend see we know how much the user has to pay, the data we get back contains a clientSecret that stripe creates specifically for each payment
            const sid = localStorage.getItem('session')
            const { data } = await axios.post(`${apiUrl}/cart/payment`, { totalAmount: totalCost(cart).total, session: sid }, { withCredentials: true });
            // We then check if the user has paid using that clientSecret we got from stripe on the backend
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                },
            });
            // If an error was returned by our payment check then alert the user
            if (result.error) {
                toast.error(result.error.message, { position: 'top-center', hideProgressBar: true, pauseOnHover: false, draggable: true, theme: 'colored', transition: Bounce });
            } else {
                // If it was a success then proceed to make the order in the database by querying the backend endpoint
                if (result.paymentIntent?.status === 'succeeded') {
                    if (isIOS()) {
                        const sid = localStorage.getItem('session')
                        await axios.post(`${apiUrl}/order/create`, { totalAmount: totalCost(cart).total, cart, session: sid }, { withCredentials: true });
                    } else {
                        await axios.post(`${apiUrl}/order/create`, { totalAmount: totalCost(cart).total, cart }, { withCredentials: true });
                    }
                    handleSuccessfulCheckout();
                }
            }
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Error processing payment');
                console.log(err);
            }
            toast.error('Error processing payment', { position: 'top-center', hideProgressBar: true, pauseOnHover: false, draggable: true, theme: 'colored', transition: Bounce });
        }
        setIsProcessing(false);
    }

    // Defining styles to pass into our card element from stripe
    const cardElementOptions = {
        style: {
            base: {
                color: 'white',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: 'red',
                iconColor: 'white',
            },
        },
    };

    return (
        <>{isLoggedIn ?
            <div className="checkoutMainContent">
                <ToastContainer />
                <div className="cartShowcase">
                    <div className={`carousel ${cartLoading || cart.length === 0 ? 'loading' : ''}`}>
                        {cart.length === 0 ? (
                            cartLoading ?
                                <div className="cartItem">
                                    <div className="cartItemDetails" style={{ border: 'none' }}>
                                        <p>Loading...</p>
                                    </div>
                                </div> :
                                <div className="cartItem">
                                    <div className="cartItemDetails" style={{ border: 'none' }}>
                                        <p>Cart Is Empty</p>
                                    </div>
                                </div>
                        ) :
                            cart.map((product, index) => (
                                <div className="cartItem" key={index}>
                                    <div className="cartItemDetails">
                                        <img src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                        <p>{product.name}</p>
                                        <p>${product.price}</p>
                                        <p>Cart: {product.quantity}</p>
                                        <button className='removeItemBtn' disabled={isRemoving} onClick={() => handleItemRemove(product.productid)}>{isRemoving ? 'Removing...' : 'Remove Item'}</button>
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
                            <CardElement id="cardElement" options={cardElementOptions} />
                        </div>
                        <p className='totalItems'> {totalItems(cart).string}</p>
                        <p className='totalCost'>{totalCost(cart).string}</p>
                        <div className="cartBtns">
                            <Link to={'/'}>Go Home</Link>
                            <button type="submit" disabled={isProcessing}>{isProcessing ? 'Processing…' : 'Checkout'}</button>
                        </div>
                    </form>
                </div>
            </div>
            :
            <>
                <div className="checkoutLoggedOutContent">
                    <h1>Login to checkout</h1>
                </div>
            </>}
        </>
    )
}

