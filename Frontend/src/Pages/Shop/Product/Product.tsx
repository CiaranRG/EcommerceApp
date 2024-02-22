import { useEffect, useState } from 'react'
import './Product.scss'
import axios from 'axios'

type productProps = {
    demographic: string,
    category: string,
}

export default function Product({ demographic, category }: productProps) {

    return (
        <main className='productMainContent'>
            <div className='productTop'></div>
            <div className='productBottom'>
                <h3>Product Name</h3>
                <p>Price - $50</p>
                <p>Stock - 3</p>
                <button>View More</button>
            </div>
        </main>
    )
}