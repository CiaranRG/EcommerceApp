import { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import './ProductDisplay.scss'

type ProductParams = {
    id: string,
    demographic: string,
    category: string,
};


export default function ProductDisplay() {
    const { id, category, demographic } = useParams<ProductParams>();
    const [product, setProduct] = useState({ name: '', price: null, stock: '', description: '', imageurl: '' })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const gatherProduct = async () => {
            try {
                setIsLoading(true)
                // Adding in a params object so I can grab them on the backend with req.query
                const result = await axios.get('http://localhost:5000/products/getProduct', { params: { id } });
                console.log(result.data)
                setProduct(result.data);
                setIsLoading(false)
            } catch (err) {
                console.error('Error on gatherProduct()', err);
            }
        }

        if (id) {
            gatherProduct();
        } else {
            console.error('No product ID provided in URL');
        }
    }, [id]); // Include 'id' as a dependency

    return (
        <main className='productDisplayMainContent'>
            {isLoading ? <>
                <div className="isLoadingDiv">
                    <h1>Loading...</h1>
                </div>
            </> : <>
            <div className='productDisplayTop'>
                    <img src={product.imageurl} alt="" />
                </div>
                <div className='productDisplayBottom'>
                    <div className="productDetails">
                        <h3 className="productTitle">{product.name}</h3>
                        <p className="productDescription">{product.description}</p>
                        <p className="productPrice">Price - ${product.price}</p>
                        <p className="productStock">Stock - {product.stock}</p>
                    </div>
                    <div className="productDisplayButtonsDiv">
                        <Link to={`/shop/${demographic}/${category}`} className="productBackBtn">Go Back</Link>
                        <button className="productAddToCart">Add to Cart</button>
                    </div>
                </div>
            </>}
        </main>
    )
}