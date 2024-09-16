import './Login.scss'
import { useState } from 'react'
import axios from 'axios'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import isIOS from '../../../utils/isIOS';


type FormData = {
    username: string,
    password: string,
    isIOS: boolean,
}

type Props = {
    onLogin: () => void,
}

const apiUrl = import.meta.env.VITE_API_URL;

export default function Login({ onLogin }: Props) {
    const [formData, setFormData] = useState<FormData>({ username: '', password: '', isIOS: isIOS()})
    const [isLoggingIn, setIsLoggingIn] = useState(false)

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        // Destructure the name and value from the inputs
        const { name, value } = evt.target;
        // Catch the prevInfo, spread the info and add in the name:value
        setFormData((prevInfo) => ({ ...prevInfo, [name]: value }))
    }

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        setIsLoggingIn(true)
        evt.preventDefault()
        try {
            const response = await axios.post(`${apiUrl}/accounts/login`, formData, { withCredentials: true })
            if (response.data.sessionId){
                localStorage.setItem('session', response.data.sessionId)
            }
            setFormData({ username: '', password: '', isIOS: isIOS()})
            setIsLoggingIn(false)
            onLogin()
        } catch (err) {
            // Checking if the error is an axios error
            if (axios.isAxiosError(err)) {
                // Assigning this to a variable as it can either be a httpResponse or undefined
                const serverResponse = err.response
                // We then check if it was a httpResponse or undefined, if it was httpResponse and the message contains User not found this code runs
                if (serverResponse && serverResponse.data.message === 'User not found') {
                    setIsLoggingIn(false)
                    return toast.error("Incorrect details, try again!", { position: 'top-center', hideProgressBar: true, pauseOnHover: false, draggable: true, theme: 'colored', transition: Bounce });
                } else if (serverResponse && serverResponse.data.message === 'Incorrect details') {
                    setIsLoggingIn(false)
                    return toast.error("Incorrect details, try again!", { position: 'top-center', hideProgressBar: true, pauseOnHover: false, draggable: true, theme: 'colored', transition: Bounce });
                }
                // If its not an axios error we do something else
            } else {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Handle Submit Error')
                    console.log(err)
                }
            }
            setIsLoggingIn(false)
        }
    }

    return (
        <>
            <main className='loginMainContent'>
                <ToastContainer />
                <h1 className='loginHeader'>Login Now!</h1>
                <form action="" onSubmit={handleSubmit} className='loginForm'>
                    <div className='loginFormDiv'>
                        <label htmlFor="username">Please enter your username:</label>
                        <input type="text" required name='username' placeholder='Username' onChange={handleChange} value={formData.username} autoComplete='username' />
                    </div>
                    <div className='loginFormDiv'>
                        <label htmlFor="password">Please enter your password:</label>
                        <input type="password" required name='password' placeholder='Password' onChange={handleChange} value={formData.password} autoComplete='off' />
                    </div>
                    <button className='loginFormButton' disabled={isLoggingIn}>{isLoggingIn ? 'Logging in' : 'Login!'}</button>
                </form>
            </main>
        </>
    )
}