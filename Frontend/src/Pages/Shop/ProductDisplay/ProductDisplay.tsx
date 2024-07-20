import { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import './ProductDisplay.scss'

type ProductParams = {
    id: string,
    demographic: string,
    category: string,
};

interface Product {
    id: number;
    name: string;
    price: number | null;
    stock: string;
    description: string;
    imageurl: string;
    quantity?: number;
}

export default function ProductDisplay({ isLoggedIn }: { isLoggedIn: boolean }) {
    const { id, category, demographic } = useParams<ProductParams>();
    const [product, setProduct] = useState<Product>({ id: 0, name: '', price: null, stock: '', description: '', imageurl: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const gatherProduct = async () => {
            try {
                setIsLoading(true);
                const result = await axios.get('http://localhost:5000/products/getProduct', { params: { id } });
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Entering gather product');
                    console.log(result.data);
                }
                setProduct(result.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error on gatherProduct()', err);
                setIsLoading(false);
            }
        };

        if (id) {
            gatherProduct();
        } else {
            console.error('No product ID provided in URL');
        }
    }, [id]);

    const handleAddToCart = async () => {
        setIsAdding(true);
        if (!isLoggedIn) {
            setIsAdding(false);
            return alert('Please log in to add things to your cart')
        }
        try {
            await axios.post('http://localhost:5000/cart/add', { productId: product.id }, { withCredentials: true });
            alert('Product added to cart');
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Error adding to cart', err);
            }
        }
        setIsAdding(false);
    };



    return (
        <main className='productDisplayMainContent'>
            {isLoading ? (
                <div className="isLoadingDiv">
                    <h1>Loading...</h1>
                </div>
            ) : (
                <>
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
                            <button className="productAddToCart" onClick={handleAddToCart} disabled={isAdding}>
                                {isAdding ? 'Adding...' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}
