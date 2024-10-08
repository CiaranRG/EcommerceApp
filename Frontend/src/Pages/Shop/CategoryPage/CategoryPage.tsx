import './CategoryPage.scss'
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Product from '../Product/Product';

const validDemographics = ['mens', 'womens', 'kids']
const validCategories = ['sweatshirts', 'shoes', 'joggers', 'tops', 'shorts', 'hats']

type categoryParam = {
    demographic: string,
    category: string,
}

const apiUrl = import.meta.env.VITE_API_URL;

export default function CategoryPage() {
    // Setting some defaults to solve typescript error, if there is nothing inside these then the defaults take over and since we redirect if they aren't in our allotted words then we just redirect to our 404
    const { demographic = 'redirect', category = 'redirect' } = useParams<categoryParam>()
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (!validDemographics.includes(demographic) || !validCategories.includes(category)) {
            navigate('/')
        }
    })

    useEffect(() => {
        const gatherProducts = async () => {
            try {
                setIsLoading(true)
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Entering gather products')
                }
                // Adding in a params object so I can grab them on the backend with req.query
                const result = await axios.get(`${apiUrl}/products`, { params: { demographic, category } })
                setProducts(result.data)
                setIsLoading(false)
            } catch (err) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Error on gatherProducts()')
                    console.log(err)
                }
            }
        }
        gatherProducts()
    }, [])

    return (
        <>
            <main className='categoryPageMainContent'>
                <div className='categoryPageHeaderDiv'>
                    <h1 className='categoryPageHeader'>{demographic} {category}</h1>
                    <Link className='categoryPageGoBackBtn' to={`/shop/${demographic}/categories`}>
                        Click here to go back!
                    </Link>
                </div>
                <div className='productsList'>
                    {isLoading ? <>
                        <h1>Loading...</h1>
                    </> : products.map((product, index) => (
                        <Product key={index} product={product} />
                    ))}
                </div>
            </main>
        </>
    )
}