// Importing database connection using pg
import pg from 'pg'
const { Pool } = pg

// Importing dotenv file
import { config } from 'dotenv'

// Loading the dotenv file
config()

console.log(`DB User: ${process.env.PG_USER}, DB Name: ${process.env.PG_DATABASE}, DB Pass: ${process.env.PG_PASS}`);

// Creating a new database connection
const db = new Pool({
    user: process.env.PG_USER,
    host: 'localhost',
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASS,
    // This is the default port for a postgres database
    port: 5432,
})

export default db