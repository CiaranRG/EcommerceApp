import './Product.scss'
import { useNavigate, useParams } from 'react-router-dom';


type productProps = {
    product: {
        categoryid: number,
        demographic: string,
        description: string,
        id: number,
        imageurl?: string,
        name: string,
        price: number,
        stock: number
    }
}

export default function Product({ product }: productProps) {
    const navigate = useNavigate();
    const { category } = useParams()

    const handleViewMore = () => {
        navigate(`/shop/${product.demographic}/${category}/product/${product.id}`);
    };

    return (
        <main className='productMainContent'>
            <div className='productTop'></div>
            <div className='productBottom'>
                <h3>{product.name}</h3>
                <p>Price - ${product.price}</p>
                <p>Stock - {product.stock}</p>
                <button onClick={handleViewMore}>View More</button>
            </div>
        </main>
    )
}