import { useEffect, useState } from 'react'
import './Product.scss'
import axios from 'axios'

type productProps = {
    demographic: string,
    category: string,
}

export default function Product({ demographic, category }: productProps) {

    const [products, setProducts] = useState({})

    useEffect(() => {
        const gatherProducts = async () => {
            try {
                // Adding in a params object so I can grab them on the backend with req.query
                const result = await axios.get('http://localhost:5000/products', { params: { demographic, category } })
            } catch (err) {

            }
        }
    }, [])

    return (
        <main className='productMainContent'>
            <div className='productTop'>

            </div>
            <div className='productBottom'>
                <h3>Product Name</h3>
                <p>Price - $50</p>
                <p>Stock - 3</p>
                <button>View More</button>
            </div>
        </main>
    )
}