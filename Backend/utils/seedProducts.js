import db from "./databaseConnection.js";

const productsDB = [
    {
        name: 'Grey Sweatshirt',
        description: 'Its a grey sweatshirt',
        price: 49.99,
        categoryid: 'CHANGE THIS TO THE CATEGORY ONCE MADE',
        stock: 3,
        imgurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    }
]

const seedProducts = async () => {
    // Wiping and restarting the database 
    await db.query('TRUNCATE product RESTART IDENTITY;')

    try {
        // Looping the array to seed the database 
        for (let product in productsDB) {
            await db.query('INSERT INTO product(name, description, price, categoryid, stock, imgurl) VALUES ($1, $2, $3, $4, $5, $6)', [product.name, product.description, product.price, product.categoryid, product.stock, product.imgurl])
        }
    } catch (error) {
        // Only logging the error in the development enviroment
        if (process.env.NODE_ENV === 'development') {
            console.log('Error Occurred', error)
        }
    }

}