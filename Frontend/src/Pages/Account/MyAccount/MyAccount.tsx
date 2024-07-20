import axios from 'axios'
import './MyAccount.scss'
import { useEffect, useState } from 'react'

interface Product {
    id: number;
    name: string;
    price: number;
    imageurl: string;
}

interface OrderItem {
    product: Product;
    quantity: number;
}

interface Order {
    id: number;
    items: OrderItem[];
}

interface UserData {
    accountId: number | null;
    username: string;
    password: string;
    oldPassword: string;
    email: string;
}

interface UserAddress {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone_number: string;
}


export default function MyAccount() {
    const [userData, setUserData] = useState<UserData>({ accountId: null, username: '', password: 'default', oldPassword: 'default', email: '' })
    const [userAddress, setUserAddress] = useState<UserAddress>({ addressLine1: '', addressLine2: '', city: '', state: '', postal_code: '', country: '', phone_number: '' })
    const [userOrders, setUserOrders] = useState<Order[]>([])
    // State for changing button text and disabling the button
    const [isConfirming, setIsConfirming] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Create a function to handle updating the inputs
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        // Catch the prevInfo, spread the info and add in the name:value
        setUserData((prevData) => ({ ...prevData, [name]: value }))
    }

    const handleAddressChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = evt.target;
        setUserAddress((prevData) => ({ ...prevData, [name]: value }))
    }

    useEffect(() => {
        const gatherUserData = async () => {
            try {
                const result = await axios.get('http://localhost:5000/accounts', { withCredentials: true });
                setUserData({
                    accountId: result.data.data.accountid || null,
                    username: result.data.data.username || '',
                    email: result.data.data.email || '',
                    password: 'default' || 'default',
                    oldPassword: 'default' || 'default'
                });
                setUserAddress({
                    addressLine1: result.data.data.address_line1 || '',
                    addressLine2: result.data.data.address_line2 || '',
                    city: result.data.data.city || '',
                    state: result.data.data.state || '',
                    postal_code: result.data.data.postal_code || '',
                    country: result.data.data.country || '',
                    phone_number: result.data.data.phone_number || '',
                });

                const orderResult = await axios.get('http://localhost:5000/order', { withCredentials: true });

                if (orderResult.data.data) {
                    setUserOrders(orderResult.data.data);
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('User orders set:', orderResult.data.data);
                    }
                } else {
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('No orders');
                    }
                }
                // Map over the data then inside map over the items, with each items map pull the product details needed and the quantity
            } catch (err) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(err)
                }
            }

        }
        gatherUserData()
    }, [])

    const handleUsernameSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        setIsConfirming(true)
        // Creating an object to send specific data instead of the whole thing
        const dataToSend = {
            accountId: userData.accountId,
            username: userData.username
        }
        try {
            const response = await axios.post('http://localhost:5000/accounts/changeUsername', dataToSend, { withCredentials: true })
            if (response.status === 200) {
                window.location.reload();
                setIsConfirming(false)
            }
        } catch (err) {
            // Checking if the error is an axios error, which would mean an error occured at any point during the axios request
            if (axios.isAxiosError(err)) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Handle username change error')
                }
                // Assigning this to a variable as it can either be a httpResponse or undefined
                const serverResponse = err.response
                // We then check if it was a httpResponse or undefined, if it was httpResponse and the message contains User not found this code runs
                if (serverResponse?.status === 500) {
                    return alert("Internal server error, try again later!");
                } else if (serverResponse?.status === 400) {
                    return alert("Please enter a valid username between 3-30 characters!");
                }
                // If its not an axios error we do something else
            } else {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Handle username change error')
                    console.log(err)
                }
            }
            setIsConfirming(false)
        }
    }

    const handleEmailSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        setIsConfirming(true)
        // Creating an object to send specific data instead of the whole thing
        const dataToSend = {
            accountId: userData.accountId,
            email: userData.email
        }
        try {
            const response = await axios.post('http://localhost:5000/accounts/changeEmail', dataToSend, { withCredentials: true })
            if (response.status === 200) {
                window.location.reload();
                setIsConfirming(false)
            }
        } catch (err) {
            // Checking if the error is an axios error, which would mean an error occured at any point during the axios request
            if (axios.isAxiosError(err)) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Handle email change error')
                }
                // Assigning this to a variable as it can either be a httpResponse or undefined
                const serverResponse = err.response
                // We then check if it was a httpResponse or undefined, if it was httpResponse and the message contains User not found this code runs
                if (serverResponse?.status === 500) {
                    return alert("Internal server error, try again later!");
                } else if (serverResponse?.status === 400) {
                    return alert("Please enter a valid email!");
                }
            } else {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Handle email change error')
                    console.log(err)
                }
            }
            setIsConfirming(false)
        }
    }

    const handlePasswordSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        setIsConfirming(true)
        // Creating an object to send specific data instead of the whole thing
        const dataToSend = {
            accountId: userData.accountId,
            password: userData.password
        }
        try {
            const response = await axios.post('http://localhost:5000/accounts/changePassword', dataToSend, { withCredentials: true })
            if (response.status === 200) {
                window.location.reload();
                setIsConfirming(false)
            }
        } catch (err) {
            // Checking if the error is an axios error, which would mean an error occurred at any point during the axios request
            if (axios.isAxiosError(err)) {
                if (process.env.NODE_ENV !== 'production') {
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('Handle password change error')
                    }
                }
                const serverResponse = err.response;
                if (serverResponse?.status === 500) {
                    return alert("Internal server error, try again later!");
                } else if (serverResponse?.status === 400) {
                    return alert("Please enter a valid password between 3-30 characters!");
                }
            } else {
                if (process.env.NODE_ENV !== 'production') {
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('Handle password change error')
                        console.log(err)
                    }
                }
            }
            setIsConfirming(false)
        }
    }

    const handleAddressSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        setIsConfirming(true)
        // Creating an object to send specific data instead of the whole thing
        const dataToSend = {
            addressLine1: userAddress.addressLine1,
            addressLine2: userAddress.addressLine2,
            city: userAddress.city,
            state: userAddress.state,
            postal_code: userAddress.postal_code,
            country: userAddress.country,
            phone_number: userAddress.phone_number
        }
        try {
            const response = await axios.post('http://localhost:5000/accounts/changeAddress', dataToSend, { withCredentials: true })
            if (response.status === 200) {
                window.location.reload();
                setIsConfirming(false)
            }
        } catch (err) {
            // Checking if the error is an axios error, which would mean an error occurred at any point during the axios request
            if (axios.isAxiosError(err)) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Handle address change error')
                }
                const serverResponse = err.response;
                if (serverResponse?.status === 500) {
                    setIsConfirming(false)
                    return alert("Internal server error, try again later!");
                } else if (serverResponse?.status === 400) {
                    setIsConfirming(false)
                    return alert("Please enter a valid address!");
                }
            } else {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Handle address change error')
                    console.log(err)
                }
            }
            setIsConfirming(false)
        }
    }

    const handleAccountDeletion = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        setIsDeleting(true)
        const dataToSend = {
            accountId: userData.accountId,
        }
        try {
            const response = await axios.post('http://localhost:5000/accounts/deleteAccount', dataToSend, { withCredentials: true })
            if (response.status === 200) {
                window.location.reload();
                setIsDeleting(false)
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Handle account deletion error')
                }
                const serverResponse = err.response;
                if (serverResponse?.status === 500) {
                    return alert("Internal server error, try again later!");
                }
            } else {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Handle account deletion error')
                    console.log(err)
                }
            }
            setIsDeleting(false)
        }
    }

    const handleOrderCancel = async (orderId: number) => {
        try {
            setIsConfirming(true)
            const result = await axios.post('http://localhost:5000/order/cancel', { orderId: orderId }, { withCredentials: true })
            console.log(result)
            setIsConfirming(false)
            window.location.reload()
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.log(err)
            }
            setIsConfirming(false)
        }
    }

    return (
        <>
            <main className='myAccountMainContent'>
                <h1 className='myAccountHeader'>Account Settings</h1>
                <div className='myAccountUserAndPassDiv'>
                    <p className='editAccountText'>Edit account details:</p>
                    <div>
                        <form action="" className='emailChangeForm' onSubmit={handleEmailSubmit}>
                            <label htmlFor="email" className='userLabel'>Email</label>
                            <input type="email" placeholder='Email' id='email' name='email' className='userInput' min={3} max={30} value={userData.email} onChange={handleChange} autoComplete='email' required />
                            <button disabled={isConfirming || isDeleting} >{isConfirming ? 'Hold...' : 'Confirm'}</button>
                        </form>
                        <form action="" className='usernameChangeForm' onSubmit={handleUsernameSubmit}>
                            <label htmlFor="username" className='userLabel'>Username</label>
                            <input type="text" placeholder='Username' id='username' name='username' className='userInput' min={3} max={20} value={userData.username} onChange={handleChange} autoComplete='username' required />
                            <button disabled={isConfirming || isDeleting} >{isConfirming ? 'Hold...' : 'Confirm'}</button>
                        </form>
                        <form action="" className='passwordChangeForm' onSubmit={handlePasswordSubmit}>
                            <label htmlFor="password" className='passLabel'>Password</label>
                            <input type="password" placeholder='Password' id='password' name='password' className='passInput' value={userData.password} onChange={handleChange} autoComplete='off' required />
                            <button disabled={isConfirming || isDeleting} >{isConfirming ? 'Hold...' : 'Confirm'}</button>
                        </form>
                    </div>
                    <p className='deleteAccountText'>Click below to delete your account</p>
                    <form action="" onSubmit={handleAccountDeletion}>
                        <button type='submit' className='deleteAccountBtn' disabled={isDeleting || isConfirming}>{isDeleting ? 'Deleting...' : 'Delete Account'}</button>
                    </form>
                </div>
                <div className='shippingAddressDiv'>
                    <p>Edit shipping details:</p>
                    <form action="" onSubmit={handleAddressSubmit}>
                        {/* Using a grid setup for the form instead of flex */}
                        <label htmlFor="addressLineOne" className='shippingLineOneLabel'>Address Line 1</label>
                        <input type="text" placeholder='Address Line 1' id='addressLine1' name='addressLine1' value={userAddress.addressLine1} onChange={handleAddressChange} autoComplete='address-line1' />
                        <label htmlFor="" className='shippingLineTwoLabel'>Address Line 2</label>
                        <input type="text" placeholder='Address Line 2' id='addressLine2' name='addressLine2' value={userAddress.addressLine2} onChange={handleAddressChange} autoComplete='address-line2' />
                        <label htmlFor="" className='shippingCityLabel'>City</label>
                        <input type="text" placeholder='City' id='city' name='city' value={userAddress.city} onChange={handleAddressChange} autoComplete='address-level2' />
                        <label htmlFor="">State</label>
                        <input type="text" placeholder='State ' id='state' name='state' value={userAddress.state} onChange={handleAddressChange} className='shippingStateLabel' autoComplete='state' />
                        <label htmlFor="">Post Code</label>
                        <input type="text" placeholder='Post Code' id='postal_code' name='postal_code' value={userAddress.postal_code} onChange={handleAddressChange} className='shippingPostCodeLabel' autoComplete='postal-code' />
                        <label htmlFor="" className='shippingCountryLabel'>Country</label>
                        <select name="country" id="country" onChange={handleAddressChange} value={userAddress.country} autoComplete="country">
                            <option value="">Choose a country!</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United States">United States</option>
                            <option value="Italy">Italy</option>
                            <option value="Germany">Germany</option>
                        </select>
                        <label htmlFor="" className='shippingPhoneNumberLabel'>Phone Number</label>
                        <input type="tel" placeholder='Phone Number' id='phone_number' name='phone_number' value={userAddress.phone_number} onChange={handleAddressChange} autoComplete='tel' />
                        <button disabled={isConfirming || isDeleting}>{isConfirming ? 'Submitting...' : 'Submit'}</button>
                    </form>
                </div>
                <h3>Order Tracking</h3>
                <div className='orderTrackingDiv'>
                    <div className='orderTrackingDiv'>
                        {userOrders.length > 0 ? userOrders.map((order, index) => (
                            <div className="orderDiv" key={index}>
                                <p className='orderNumText'>Order Number: #{order.id}</p>
                                {order.items && order.items.map((item, itemIndex) => (
                                    <div className="orderItem" key={itemIndex}>
                                        <img src={item.product.imageurl} alt={item.product.name} />
                                        <div className="orderDetails">
                                            <p>{item.product.name}</p>
                                            <p>${item.product.price}</p>
                                            <p>Purchased: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                                <button disabled={isConfirming || isDeleting} onClick={() => handleOrderCancel(order.id)}>{isConfirming ? 'Cancelling' : 'Cancel Order'}</button>
                            </div>
                        )) : <p>No orders found</p>}
                    </div>
                </div>
            </main>
        </>
    )
}