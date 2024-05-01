import './Login.scss'
import { useState } from 'react'
import axios from 'axios'

type FormData = {
    username: string,
    password: string,
}

type Props = {
    onLogin: () => void,
}

export default function Login({ onLogin }: Props) {
    const [formData, setFormData] = useState<FormData>({ username: '', password: '' })

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        // Destructure the name and value from the inputs
        const { name, value } = evt.target;
        // Catch the prevInfo, spread the info and add in the name:value
        setFormData((prevInfo) => ({ ...prevInfo, [name]: value }))
    }

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        try {
            await axios.post('http://localhost:5000/accounts/login', formData, { withCredentials: true })
            setFormData({ username: '', password: '' })
            onLogin()
        } catch (err) {
            // Checking if the error is an axios error
            if (axios.isAxiosError(err)) {
                console.log('Handle Submit Error')
                // Assigning this to a variable as it can either be a httpResponse or undefined
                const serverResponse = err.response
                // We then check if it was a httpResponse or undefined, if it was httpResponse and the message contains User not found this code runs
                if (serverResponse && serverResponse.data.message === 'User not found') {
                    return alert("This user doesn't exist or the credentials are wrong, try again!")
                } else if (serverResponse && serverResponse.data.message === 'Incorrect details' ){
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
            <main className='loginMainContent'>
                <h1 className='loginHeader'>Login Now!</h1>
                <form action="" onSubmit={handleSubmit} className='loginForm'>
                    <div className='loginFormDiv'>
                        <label htmlFor="username">Please enter your username:</label>
                        <input type="text" required name='username' placeholder='Username' onChange={handleChange} value={formData.username} />
                    </div>
                    <div className='loginFormDiv'>
                        <label htmlFor="password">Please enter your password:</label>
                        <input type="password" required name='password' placeholder='Password' onChange={handleChange} value={formData.password} />
                    </div>
                    <button className='loginFormButton'>Login!</button>
                </form>
            </main>
        </>
    )
}