// The DB function i created will not work in here so we setup a new connection specifically for this file
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the .env file
const envPath = join(__dirname, '..', '.env');
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

const categoriesDB = [
    {
        name: 'Sweatshirts'
    },
    {
        name: 'Shoes'
    },
    {
        name: 'Joggers'
    },
    {
        name: 'Tops'
    },
    {
        name: 'Shorts'
    },
    {
        name: 'Hats'
    },
]

const seedCategories = async () => {
    console.log('Starting to seed categories...');
    // Wiping and restarting the database , we add cascade since our category table will be foreign keys for other tables
    await db.query('TRUNCATE category RESTART IDENTITY CASCADE')
    console.log('Categories table truncated.');
    try {
        // Looping the array to seed the database 
        for (let category of categoriesDB) {
            console.log(`Inserting category: ${category.name}`);
            await db.query('INSERT INTO category (name) VALUES ($1)', [category.name])
        }
        console.log('Finished inserting categories.');
    } catch (error) {
        console.log('Error Occurred', error)
    }

}

// Call function then end the database connection
seedCategories().then(() => {
    db.end()
}).catch((err) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(err)
    }
})

