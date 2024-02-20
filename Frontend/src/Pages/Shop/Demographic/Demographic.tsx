import { Link } from 'react-router-dom'
import './Demographic.scss'

export default function Demographics() {

    return (
        <>
            <main className="demographicsMainContent">
                <div className='demographicCard men'>
                    <Link to={'/shop/mens/categories'}>Men</Link>
                </div>
                <div className='demographicCard women'>
                    <Link to={'/shop/womens/categories'}>Women</Link>
                </div>
                <div className='demographicCard child'>
                    <Link to={'/shop/kids/categories'}>Kids</Link>
                </div>
            </main>
        </>
    )
}