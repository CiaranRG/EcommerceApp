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
                    <Link className='categoriesGoBackBtn' to={`/shop`}>
                        Click here to go back!
                    </Link>
                    <Link to={`/shop/${demographic}/sweatshirts`}>
                        Sweatshirts
                    </Link>
                    <Link to={`/shop/${demographic}/shoes`}>
                        Shoes
                    </Link>
                    <Link to={`/shop/${demographic}/joggers`}>
                        Joggers
                    </Link>
                    <Link to={`/shop/${demographic}/tops`}>
                        Tops
                    </Link>
                    <Link to={`/shop/${demographic}/shorts`}>
                        Shorts
                    </Link>
                    <Link to={`/shop/${demographic}/hats`}>
                        Hats
                    </Link>
                </div>
            </main>
        </>
    )
}