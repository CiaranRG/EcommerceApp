import './Product.scss'

type productProps = {
    demographic: string,
    category: string,
}

export default function Product({demographic, category}: productProps) {

    console.log(demographic, category)


    return (
        <main className='productMainContent'>
            <div className='productTop'>
                
            </div>
            <div className='productBottom'>
                <h3>Product</h3>
            </div>
        </main>
    )
}