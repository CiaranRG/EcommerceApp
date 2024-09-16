import { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductDisplay.scss'
import isIOS from "../../../utils/isIOS";

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

const apiUrl = import.meta.env.VITE_API_URL;

export default function ProductDisplay({ isLoggedIn }: { isLoggedIn: boolean }) {
    const { id, category, demographic } = useParams<ProductParams>();
    const [product, setProduct] = useState<Product>({ id: 0, name: '', price: null, stock: '', description: '', imageurl: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const gatherProduct = async () => {
            try {
                setIsLoading(true);
                const result = await axios.get(`${apiUrl}/products/getProduct`, { params: { id } });
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Entering gather product');
                    console.log(result.data);
                }
                setProduct(result.data);
                setIsLoading(false);
            } catch (err) {

                setIsLoading(false);
                toast.error('Failed to load product details.', { position: 'top-center', hideProgressBar: true, pauseOnHover: false, draggable: true, theme: 'colored', transition: Bounce });
            }
        };

        if (id) {
            gatherProduct();
        } else {
            if (process.env.NODE_ENV !== 'production') {
                console.log('No product ID provided in URL');
            }
        }
    }, [id]);

    const handleAddToCart = async () => {
        setIsAdding(true);
        if (!isLoggedIn) {
            setIsAdding(false);
            return toast.info('Login to add items to your cart', { position: 'top-center', hideProgressBar: true, pauseOnHover: false, draggable: true, theme: 'colored', transition: Bounce });
        }
        try {
            if (isIOS()) {
                const sid = localStorage.getItem('session')

                await axios.post(`${apiUrl}/cart/add`, { productId: product.id, session: sid });
            } else {
                await axios.post(`${apiUrl}/cart/add`, { productId: product.id }, { withCredentials: true });
            }
            toast.success('Added to cart', { position: 'top-center', hideProgressBar: true, pauseOnHover: false, draggable: true, theme: 'colored', transition: Bounce });
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Error adding to cart', err);
            }
            toast.error('Failed to add product to cart', { position: 'top-center', hideProgressBar: true, pauseOnHover: false, draggable: true, theme: 'colored', transition: Bounce });
        }
        setIsAdding(false);
    };

    return (
        <main className='productDisplayMainContent'>
            <ToastContainer />
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

