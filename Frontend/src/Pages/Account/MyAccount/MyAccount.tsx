import './MyAccount.scss'
import { useState } from 'react'

export default function MyAccount() {
    const [userData, setUserData] = useState({ username: 'defaultdefault', password: 'default' })
    const [userAddress, setUserAddress] = useState({ name: '', addressLineOne: '', addressLineTwo: '', city: '', state: '', postCode: '', country: '', phoneNumber: null })

    // Create a function to handle updating the inputs
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        // Catch the prevInfo, spread the info and add in the name:value
        setUserData((prevData) => ({ ...prevData, [name]: value }))
    }

    return (
        <>
            <main className='myAccountMainContent'>
                <h1 className='myAccountHeader'>{userData.username}'s Account</h1>
                <div className='myAccountUserAndPassDiv'>
                    <p>Edit Username and Password:</p>
                    <form action="">
                        <div>
                            <label htmlFor="username" className='userLabel'>Username </label>
                            <input type="text" placeholder='Username' id='username' name='username' className='userInput' min={3} max={20} value={userData.username} onChange={handleChange} required />
                            <label htmlFor="password" className='passLabel'>Password </label>
                            <input type="password" placeholder='Password' id='password' name='password' className='passInput' value={userData.password} onChange={handleChange} required />
                        </div>
                        <button>Change</button>
                    </form>
                    <button className='deleteAccountBtn'>Delete Account</button>
                </div>
                <div className='shippingAddressDiv'>
                    <p>Edit Shipping Details:</p>
                    <form action="" >
                        {/* Using a grid setup for the form instead of flex */}
                        <label htmlFor="" className='shippingNameLabel'>Name: </label>
                        <input type="text" placeholder='Name' />
                        <label htmlFor="" className='shippingLineOneLabel'>Address Line 1: </label>
                        <input type="text" placeholder='Address Line 1' />
                        <label htmlFor="" className='shippingLineTwoLabel'>Address Line 2: </label>
                        <input type="text" placeholder='Address Line 2' />
                        <label htmlFor="" className='shippingCityLabel'>City: </label>
                        <input type="text" placeholder='City' />
                        <label htmlFor="">State: </label>
                        <input type="text" placeholder='State ' className='shippingStateLabel' />
                        <label htmlFor="">Post Code: </label>
                        <input type="text" placeholder='Post Code' className='shippingPostCodeLabel' />
                        <label htmlFor="" className='shippingCountryLabel'>Country: </label>
                        <select name="country" id="country">
                            <option value="">United Kingdom</option>
                            <option value="">United States</option>
                            <option value="">Etc</option>
                        </select>
                        <label htmlFor="" className='shippingPhoneNumberLabel'>Phone Number: </label>
                        <input type="tel" placeholder='Phone Number' />
                        <button>Submit</button>
                    </form>
                </div>
                <h3>Order Tracking</h3>
            </main>
        </>
    )
}