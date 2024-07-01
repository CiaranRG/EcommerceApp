import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";

type ProductParams = {
    id: string,
    demographic: string,
    category: string,
};


export default function ProductDisplay() {
    const { id } = useParams<ProductParams>();
    const [product, setProduct] = useState({})

    useEffect(() => {
        const gatherProduct = async () => {
            try {
                console.log('Entering gather product')
                // Adding in a params object so I can grab them on the backend with req.query
                const result = await axios.get('http://localhost:5000/products/getProduct', { params: id })
                console.log('We passed the axios request')
                setProduct(result.data)
            } catch (err) {
                console.log('Error on gatherProduct()')
            }
        }
        gatherProduct()
    }, [])

    return (
        <main className='productDisplayMainContent'>
            <div className='productDisplayTop'></div>
            <div className='productDisplayBottom'>
                <h3>{product.name}</h3>
                <p>Price - ${product.price}</p>
                <p>Stock - {product.stock}</p>
                <button>View More</button>
            </div>
        </main>
    )
}