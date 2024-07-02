// Creating a separate file to be able to import to anywhere we need database interaction

// Importing full pg package then destructing pool from it
import pg  from 'pg'
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';


const { Pool } = pg

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the .env file
const envPath = join(__dirname, '..', '.env');
config({ path: envPath });

// Calling this to have its side effects happen (reading the .env and parsing the data)
config()

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

export default db