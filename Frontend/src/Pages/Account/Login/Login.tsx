import './Login.scss'
import { useState } from 'react'
import axios from 'axios'

type FormData = {
    username: string,
    password: string,
}

export default function Login(){
    const [formData, setFormData] = useState<FormData>({username: '', password: ''})

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        // Destructure the name and value from the inputs
        const { name, value } = evt.target;
        // Catch the prevInfo, spread the info and add in the name:value
        setFormData((prevInfo) => ({...prevInfo, [name]: value}))
    }

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        try {
            const response = await axios.post('http://localhost:5137/accounts/login', formData, { withCredentials: true })
            setFormData({username: '', password: ''})
            console.log(response.data)
        } catch (err){
            console.log('Handle Submit Error')
            console.log(err)
        }
    }

    return(
        <>
        <main className='loginMainContent'>
            <h1 className='loginHeader'>Login Now!</h1>
            <form action="" onSubmit={handleSubmit} className='loginForm'>
                <div className='loginFormDiv'>
                    <label htmlFor="username">Please enter your username:</label>
                    <input type="text" required name='username' placeholder='Username' onChange={handleChange} value={formData.username}/>
                </div>
                <div className='loginFormDiv'>
                    <label htmlFor="password">Please enter your password:</label>
                    <input type="password" required name='password' placeholder='Password' onChange={handleChange} value={formData.password}/>
                </div>
                <button className='loginFormButton'>Login!</button>
            </form>
        </main>
        </>
    )
}