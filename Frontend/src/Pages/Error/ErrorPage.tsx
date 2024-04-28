import './ErrorPage.scss'
import { Link } from 'react-router-dom'

type ErrorProps = {
    errorCode: string,
    errorMessage: string
}

export default function ErrorPage({ errorCode, errorMessage }: ErrorProps) {
    return (
        <>
        <div className='errorDiv'>
            <h1>{errorCode}</h1>
            <h2>{errorMessage}</h2>
            <Link to={'/'}>Click here to go home!</Link>
        </div>
        </>
    )
}