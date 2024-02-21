import './CategoryPage.scss'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';

const validDemographics = ['mens', 'womens', 'kids']
const validCategories = ['sweatshirts', 'shoes', 'joggers', 'tops', 'shorts', 'hats']

type categoryParam = {
    demographic: string,
    category: string,
}

export default function CategoryPage() {

    // Setting some defaults to solve typescript error, if there is nothing inside these then the defaults take over and since we redirect if they aren't in our allotted words then we just redirect to our 404
    const { demographic = 'redirect', category = 'redirect' } = useParams<categoryParam>()

    useEffect(() => {
        if (!validDemographics.includes(demographic) || !validCategories.includes(category)) {
            // Route to a 404 page
        }
    })

    return (
        <>
            <main className='categoryPageMainContent'>
                <h1 className='categoryPageHeader'>{demographic} {category}</h1>
                <div className='productsList'>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                    <Product demographic={demographic} category={category}/>
                </div>
            </main>
        </>
    )
}