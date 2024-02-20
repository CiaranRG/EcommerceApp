import './CategoryPage.scss'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const validDemographics = ['mens', 'womens', 'kids']
const validCategories = ['sweatshirts', 'shoes', 'joggers', 'tops', 'shorts', 'hats']

type categoryParam = {
    demographic: string,
    category: string,
}

export default function CategoryPage() {

    const { demographic, category } = useParams<categoryParam>()

    // useEffect(() => {
    //     if (!validDemographics.includes(demographic) || !validCategories.includes(category)){
    //         // Route to a 404 page
    //     }
    // })

    return (
        <>
            <main className='categoryPageMainContent'>
                <h1 className='categoryPageHeader'>{demographic} {category}</h1>
            </main>
        </>
    )
}