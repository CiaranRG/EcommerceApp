import './Register.scss'
import { useState } from 'react'
import axios from 'axios'

type FormData = {
    email: string,
    username: string,
    password: string,
}

export default function Register() {
    const [formData, setFormData] = useState<FormData>({ email: '', username: '', password: '' })

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        // Destructure the name and value from the inputs
        const { name, value } = evt.target;
        // Catch the prevInfo, spread the info and add in the name:value
        setFormData((prevInfo) => ({ ...prevInfo, [name]: value }))
    }

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        try {
            const response = await axios.post('http://localhost:5000/accounts', formData, { withCredentials: true })
            setFormData({ email: '', username: '', password: '' })
            if (process.env.NODE_ENV !== 'production') {
                console.log(response.data)
            }
            if (response.status === 201) {
                // Registration successful, reload the page
                window.location.reload();
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                // Assigning this to a variable as it can either be a httpResponse or undefined
                const serverResponse = err.response
                // We then check if it was a httpResponse or undefined, if it was httpResponse and the message contains the specific error
                if (serverResponse && serverResponse.data.message === 'Registration error') {
                    return alert("Registration Error")
                } else if (serverResponse && serverResponse.data.message === 'Validation error') {
                    return alert("Password and Username must be between 3-30 characters long!")
                }
            } else {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Handle Submit Error')
                    console.log(err)
                }
            }
        }
    }

    return (
        <>
            <main className='registerMainContent'>
                <h1 className='registerHeader'>Register Now!</h1>
                <form action="" onSubmit={handleSubmit} className='registerForm'>
                    <div className='registerFormDiv'>
                        <label htmlFor="email">Please enter your email:</label>
                        <input type="email" required name='email' placeholder='Email' onChange={handleChange} value={formData.email} />
                    </div>
                    <div className='registerFormDiv'>
                        <label htmlFor="username">Please enter your username:</label>
                        <input type="text" required name='username' placeholder='Username' onChange={handleChange} value={formData.username} />
                    </div>
                    <div className='registerFormDiv'>
                        <label htmlFor="password">Please enter your password:</label>
                        <input type="password" required name='password' placeholder='Password' onChange={handleChange} value={formData.password} />
                    </div>
                    <button className='registerFormButton'>Register Now!</button>
                </form>
            </main>
        </>
    )
}