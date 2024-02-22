import { Link, useParams } from 'react-router-dom'
import './Categories.scss'

export default function Categories() {
    const { demographic } = useParams<{ demographic: string }>();

    return (
        <>
            <main className="categoriesMainContent">
                {/* <div className='categoriesHeader'>
                </div> */}
                <div className='categoriesList'>
                    <h1>{demographic}</h1>
                    <Link to={`/shop`}>
                        <a className='categoriesGoBackBtn'>Click here to go back!</a>
                    </Link>
                    <Link to={`/shop/${demographic}/sweatshirts`}>
                        <a>Sweatshirts</a>
                    </Link>
                    <Link to={`/shop/${demographic}/shoes`}>
                        <a>Shoes</a>
                    </Link>
                    <Link to={`/shop/${demographic}/joggers`}>
                        <a>Joggers</a>
                    </Link>
                    <Link to={`/shop/${demographic}/tops`}>
                        <a>Tops</a>
                    </Link>
                    <Link to={`/shop/${demographic}/shorts`}>
                        <a>Shorts</a>
                    </Link>
                    <Link to={`/shop/${demographic}/hats`}>
                        <a>Hats</a>
                    </Link>
                </div>
            </main>
        </>
    )
}