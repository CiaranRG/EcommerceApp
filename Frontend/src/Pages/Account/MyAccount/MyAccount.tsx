import axios from 'axios'
import './MyAccount.scss'
import { useEffect, useState } from 'react'

export default function MyAccount() {
    const [userData, setUserData] = useState({ accountId: null, username: '', password: 'default', oldPassword: 'default', email: '' })
    const [userAddress, setUserAddress] = useState({ addressLineOne: '', addressLineTwo: '', city: '', state: '', postCode: '', country: '', phoneNumber: null })

    // Create a function to handle updating the inputs
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        // Catch the prevInfo, spread the info and add in the name:value
        setUserData((prevData) => ({ ...prevData, [name]: value }))
    }

    useEffect(() => {
        const gatherUserData = async () => {
            try {
                const result = await axios.get('http://localhost:5000/accounts', { withCredentials: true })
                // Setting the persons account details
                setUserData({
                    accountId: result.data.data.accountid || null,
                    username: result.data.data.username || '',
                    email: result.data.data.email || '',
                    password: 'default' || 'default',
                    oldPassword: 'default' || 'default'
                })
                // Setting the persons shipping details
                setUserAddress({
                    // name: result.data.data.username || '',
                    addressLineOne: result.data.data.addressLineOne || '',
                    addressLineTwo: result.data.data.addressLineTwo || '',
                    city: result.data.data.city || '',
                    state: result.data.data.state || '',
                    postCode: result.data.data.postCode || '',
                    country: result.data.data.country || '',
                    phoneNumber: result.data.data.phoneNumber || null,
                });
            } catch (err) {
                console.log(err)
            }

        }
        gatherUserData()
    }, [])

    const handleUsernameSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        // Creating an object to send specific data instead of the whole thing
        const dataToSend = {
            accountId: userData.accountId,
            username: userData.username
        }
        try {
            await axios.post('http://localhost:5000/accounts/changeUsername', dataToSend, { withCredentials: true })
        } catch (err) {
            // Checking if the error is an axios error, which would mean an error occured at any point during the axios request
            if (axios.isAxiosError(err)) {
                console.log('Handle Submit Error')
                // Assigning this to a variable as it can either be a httpResponse or undefined
                const serverResponse = err.response
                // We then check if it was a httpResponse or undefined, if it was httpResponse and the message contains User not found this code runs
                if (serverResponse && serverResponse.data.message === 'User not found') {
                    return alert("This user doesn't exist or the credentials are wrong, try again!")
                } else if (serverResponse && serverResponse.data.message === 'Incorrect details') {
                    return alert("This user doesn't exist or the credentials are wrong, try again!")
                }
                // If its not an axios error we do something else
            } else {
                console.log('Handle Submit Error')
                console.log(err)
            }
        }
    }

    return (
        <>
            <main className='myAccountMainContent'>
                <h1 className='myAccountHeader'>Account Settings</h1>
                <div className='myAccountUserAndPassDiv'>
                    <p className='editAccountText'>Edit account details:</p>
                    <div>
                        <form action="" className='emailChangeForm'>
                            <label htmlFor="email" className='userLabel'>Email</label>
                            <input type="email" placeholder='Email' id='email' name='email' className='userInput' min={3} max={30} value={userData.email} onChange={handleChange} autoComplete='email' required />
                            <button>Confirm</button>
                        </form>
                        <form action="" className='usernameChangeForm' onSubmit={handleUsernameSubmit}>
                            <label htmlFor="username" className='userLabel'>Username</label>
                            <input type="text" placeholder='Username' id='username' name='username' className='userInput' min={3} max={20} value={userData.username} onChange={handleChange} autoComplete='username' required />
                            <button>Confirm</button>
                        </form>
                        <form action="" className='passwordChangeForm'>
                            <label htmlFor="password" className='passLabel'>Password</label>
                            <input type="password" placeholder='Password' id='password' name='password' className='passInput' value={userData.password} onChange={handleChange} autoComplete='off' required />
                            <button>Confirm</button>
                        </form>
                        {/* <label htmlFor="oldPassword" className='oldPassLabel'>Old Password </label>
                        <input type="password" placeholder='Password' id='oldPassword' name='oldPassword' className='oldPassInput' value={userData.oldPassword} onChange={handleChange} required/> */}
                    </div>
                    <p className='deleteAccountText'>Click below to delete your account</p>
                    <button className='deleteAccountBtn'>Delete Account</button>
                </div>
                <div className='shippingAddressDiv'>
                    <p>Edit shipping details:</p>
                    <form action="" >
                        {/* Using a grid setup for the form instead of flex */}
                        {/* <label htmlFor="" className='shippingNameLabel'>Name: </label>
                        <input type="text" placeholder='Name' value={userData.username} onChange={handleChange} /> */}
                        <label htmlFor="" className='shippingLineOneLabel'>Address Line 1</label>
                        <input type="text" placeholder='Address Line 1' value={userAddress.addressLineOne} onChange={handleChange} autoComplete='address-line1' />
                        <label htmlFor="" className='shippingLineTwoLabel'>Address Line 2</label>
                        <input type="text" placeholder='Address Line 2' autoComplete='address-line1' />
                        <label htmlFor="" className='shippingCityLabel'>City</label>
                        <input type="text" placeholder='City' autoComplete='address-level2' />
                        <label htmlFor="">State</label>
                        <input type="text" placeholder='State ' className='shippingStateLabel' autoComplete='address-level1' />
                        <label htmlFor="">Post Code</label>
                        <input type="text" placeholder='Post Code' className='shippingPostCodeLabel' autoComplete='postal-code' />
                        <label htmlFor="" className='shippingCountryLabel'>Country</label>
                        <select name="country" id="country" autoComplete='country'>
                            <option value="">United Kingdom</option>
                            <option value="">United States</option>
                            <option value="">Etc</option>
                        </select>
                        <label htmlFor="" className='shippingPhoneNumberLabel'>Phone Number</label>
                        <input type="tel" placeholder='Phone Number' autoComplete='tel' />
                        <button>Submit</button>
                    </form>
                </div>
                <h3>Order Tracking</h3>
            </main>
        </>
    )
}