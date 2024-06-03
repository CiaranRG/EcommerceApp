// The DB function i created will not work in here so we setup a new connection specifically for this file
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const uuid = uuidv4()

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
        name: 'Charcoal Sweatshirt',
        description: 'A cozy charcoal grey sweatshirt, perfect for cool weather.',
        price: 45.99,
        categoryid: 1,
        stock: 5,
        imageurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        demographic: 'mens'
    },
    {
        name: 'Coral Sweatshirt',
        description: 'A vibrant coral pink sweatshirt, adding color to any outfit.',
        price: 52.99,
        categoryid: 1,
        stock: 7,
        imageurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        demographic: 'womens'
    },
    {
        name: 'Sky Blue Sweatshirt',
        description: 'A light blue sweatshirt, perfect for kids.',
        price: 39.99,
        categoryid: 1,
        stock: 8,
        imageurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        demographic: 'kids'
    },
    {
        name: 'Slate Grey Shoes',
        description: 'Stylish slate grey shoes for everyday wear.',
        price: 95.99,
        categoryid: 2,
        stock: 2,
        imageurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        demographic: 'mens'
    },
    {
        name: 'Rose Pink Shoes',
        description: 'Chic rose pink shoes that add a pop of color.',
        price: 89.99,
        categoryid: 2,
        stock: 5,
        imageurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        demographic: 'womens'
    },
    {
        name: 'Ocean Blue Shoes',
        description: 'Comfortable and durable ocean blue shoes for kids.',
        price: 74.99,
        categoryid: 2,
        stock: 3,
        imageurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        demographic: 'kids'
    },
    {
        name: 'Ash Grey Joggers',
        description: 'Comfortable ash grey joggers for daily wear.',
        price: 44.99,
        categoryid: 3,
        stock: 15,
        imageurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        demographic: 'mens'
    },
    {
        name: 'Peach Joggers',
        description: 'Soft and stylish peach joggers for a casual look.',
        price: 42.99,
        categoryid: 3,
        stock: 12,
        imageurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        demographic: 'womens'
    },
    {
        name: 'Aqua Blue Joggers',
        description: 'Comfortable aqua blue joggers perfect for kids.',
        price: 35.99,
        categoryid: 3,
        stock: 9,
        imageurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        demographic: 'kids'
    },
    {
        name: 'Stone Grey Top',
        description: 'A versatile stone grey top for any occasion.',
        price: 32.99,
        categoryid: 4,
        stock: 11,
        imageurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        demographic: 'mens'
    },
    {
        name: 'Lavender Top',
        description: 'A soft lavender top, ideal for a relaxed style.',
        price: 34.99,
        categoryid: 4,
        stock: 14,
        imageurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        demographic: 'womens'
    },
    {
        name: 'Sky Blue Top',
        description: 'A bright sky blue top for active kids.',
        price: 29.99,
        categoryid: 4,
        stock: 10,
        imageurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        demographic: 'kids'
    },
    {
        name: 'Graphite Shorts',
        description: 'Durable graphite grey shorts for casual wear.',
        price: 24.99,
        categoryid: 5,
        stock: 6,
        imageurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        demographic: 'mens'
    },
    {
        name: 'Blush Shorts',
        description: 'Trendy blush pink shorts for a stylish look.',
        price: 26.99,
        categoryid: 5,
        stock: 9,
        imageurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        demographic: 'womens'
    },
    {
        name: 'Blue Shorts',
        description: 'Trendy blue shorts for a stylish look.',
        price: 16.99,
        categoryid: 5,
        stock: 12,
        imageurl: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        demographic: 'kids'
    },
]


const seedProducts = async () => {
    console.log('Starting to seed categories...');
    // Wiping and restarting the database , we add cascade since our category table will be foreign keys for other tables
    await db.query('TRUNCATE product RESTART IDENTITY CASCADE')
    console.log('Categories table truncated.');
    try {
        // Looping the array to seed the database 
        for (let i = 0; i < 20; i++) {
            for (let product of productsDB) {
                console.log(`Inserting product: ${product.name}`);
                await db.query('INSERT INTO product(name, description, price, categoryid, stock, imageurl, demographic) VALUES ($1, $2, $3, $4, $5, $6, $7)', [product.name, product.description, product.price, product.categoryid, product.stock, product.imageurl, product.demographic])
            }
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