import { Link } from 'react-router-dom'
import './Demographic.scss'

export default function Demographics() {

    return (
        <>
            <main className="demographicsMainContent">
                <div className='demographicCard men'>
                    <Link to={'/mens/categories'}>Men</Link>
                </div>
                <div className='demographicCard women'>
                    <Link to={'/womens/categories'}>Women</Link>
                </div>
                <div className='demographicCard child'>
                    <Link to={'/kids/categories'}>Kids</Link>
                </div>
            </main>
        </>
    )
}