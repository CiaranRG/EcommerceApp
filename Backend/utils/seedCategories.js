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

const categoriesDB = [
    {
        name: 'sweatshirts'
    },
    {
        name: 'shoes'
    },
    {
        name: 'joggers'
    },
    {
        name: 'tops'
    },
    {
        name: 'shorts'
    },
    {
        name: 'hats'
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

