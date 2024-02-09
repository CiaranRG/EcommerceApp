// The DB function i created will not work in here so we setup a new connection specifically for this file
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Use this to get the url of the current module
const __filename = fileURLToPath(import.meta.url);
// Use this to convert that url to a file path
const __dirname = dirname(__filename);

// Using this to create a path to the .env based on the directory this is currently in
const envPath = join(__dirname, '..', '.env');
// telling config to load the .env from the path we created
config({ path: envPath });

// Importing full pg package then destructing pool from it
import pg from 'pg'
const { Pool } = pg

// Creating a new database connection
const db = new Pool({
    user: process.env.PG_USER,
    host: 'localhost',
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASS,
    // This is the default port for a postgres database
    port: 5432,
})

const productsDB = [
    {
        name: 'Grey Sweatshirt',
        description: 'Its a grey sweatshirt',
        price: 49.99,
        categoryid: 1,
        stock: 3,
        imgurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        gender: 'mens'
    },
    {
        name: 'Grey Shoes',
        description: 'Its grey shoes',
        price: 89.99,
        categoryid: 2,
        stock: 1,
        imgurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        gender: 'mens'
    },
    {
        name: 'Grey Joggers',
        description: 'Its grey joggers',
        price: 39.99,
        categoryid: 3,
        stock: 10,
        imgurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        gender: 'mens'
    },
    {
        name: 'Grey Top',
        description: 'Its a grey top',
        price: 29.99,
        categoryid: 4,
        stock: 7,
        imgurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        gender: 'mens'
    },
    {
        name: 'Grey Shorts',
        description: 'Its grey shorts',
        price: 19.99,
        categoryid: 5,
        stock: 4,
        imgurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        gender: 'mens'
    },
    {
        name: 'Grey Hat',
        description: 'Its a grey hat',
        price: 9.99,
        categoryid: 6,
        stock: 13,
        imgurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        gender: 'mens'
    },
]

const seedProducts = async () => {
    console.log('Starting to seed categories...');
    // Wiping and restarting the database , we add cascade since our category table will be foreign keys for other tables
    await db.query('TRUNCATE product RESTART IDENTITY CASCADE')
    console.log('Categories table truncated.');
    try {
        // Looping the array to seed the database 
        for (let product of productsDB) {
            console.log(`Inserting product: ${product.name}`);
            await db.query('INSERT INTO product(name, description, price, categoryid, stock, imgurl) VALUES ($1, $2, $3, $4, $5, $6)', [product.name, product.description, product.price, product.categoryid, product.stock, product.imgurl])
        }
        console.log('Finished inserting products.');
    } catch (error) {
        console.log('Error Occurred', error)
    }

}

seedProducts().then(() => {
    db.end()
}).catch((err) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(err)
    }
})