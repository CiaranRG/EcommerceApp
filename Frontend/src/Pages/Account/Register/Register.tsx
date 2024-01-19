import './Register.scss'
import { useState } from 'react'
import axios from 'axios'

type FormData = {
    email: string,
    username: string,
    password: string,
}

export default function Register(){
    const [formData, setFormData] = useState<FormData>({email: '', username: '', password: ''})

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        // Destructure the name and value from the inputs
        const { name, value } = evt.target;
        // Catch the prevInfo, spread the info and add in the name:value
        setFormData((prevInfo) => ({...prevInfo, [name]: value}))
    }

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        try {
            const response = await axios.post('http://localhost:5000/accounts', formData, {withCredentials: true})
            setFormData({email: '', username: '', password: ''})
            console.log(response.data)
        } catch (err){
            console.log('Handle Submit Error')
            console.log(err)
        }
    }

    return(
        <>
        <main className='registerMainContent'>
            <h1 className='registerHeader'>Register Now!</h1>
            <form action="" onSubmit={handleSubmit} className='registerForm'>
                <div className='registerFormDiv'>
                    <label htmlFor="email">Please enter your email:</label>
                    <input type="email" required name='email' placeholder='Email' onChange={handleChange} value={formData.email}/>
                </div>
                <div className='registerFormDiv'>
                    <label htmlFor="username">Please enter your username:</label>
                    <input type="text" required name='username' placeholder='Username' onChange={handleChange} value={formData.username}/>
                </div>
                <div className='registerFormDiv'>
                    <label htmlFor="password">Please enter your password:</label>
                    <input type="password" required name='password' placeholder='Password' onChange={handleChange} value={formData.password}/>
                </div>
                <button className='registerFormButton'>Register Now!</button>
            </form>
        </main>
        </>
    )
}