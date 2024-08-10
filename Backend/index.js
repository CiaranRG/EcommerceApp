import express from "express";
import session from "express-session";
import cors from 'cors';
import connectPgSimple from 'connect-pg-simple';
import db from "./utils/databaseConnection.js";
import cookieParser from "cookie-parser";

// Setting up dotenv
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the .env file
const envPath = join(__dirname, '..', '.env');
config({ path: envPath });

// Importing our routes
import { accountRoutes } from "./router/account.js";
import { productRoutes } from "./router/products.js";
import { cartRoutes } from "./router/cart.js";
import { orderRoutes } from "./router/orders.js";

// Loading the .env file
config()

const app = express()
const PORT = 5000

// We use this to allow connect-pg access to session so it can extend its use with our database
const pgSessions = connectPgSimple(session)


const allowedOrigin = process.env.FRONTEND_ORIGIN;

const corsOptions = {
    origin: allowedOrigin,
    credentials: true
};

app.use(cors(corsOptions))
app.use(express.json());
// Add this in so we can use the cookies on the backend
app.use(cookieParser())
app.set("trust proxy", true);
app.use(session({
    name: 'session',
    // Setting up a new pgSession to handle session storage
    store: new pgSessions({
        // Create a new pool
        pool: db,
        // We can use a custom table within our postgres database to store the sessions
        tableName: 'session'
    }),
    secret: process.env.PG_SECRET,
    // Setting this to false so a session is only created when the session object changes otherwise a session is created anytime someone visits
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: 14 * 24 * 60 * 60 * 1000,
    }
}))


// Set custom headers for CORS and Content Security Policy
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', allowedOrigin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Content-Security-Policy', `default-src 'self'; script-src 'self' ${allowedOrigin}; connect-src 'self' ${allowedOrigin};`);
    next();
});


// Handle preflight requests globally
app.options('*', cors(corsOptions));

// // Telling the app to use the cors middleware for all the preflight requests
// app.options('/api/accounts/login', cors());

// Telling my app to use these files for requests
app.use('/accounts', accountRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);

app.get('/', (req, res) => {
    try {
        res.status(200).json({ message: "We found what you were looking for!" })
    } catch (err) {
        res.status(404).json({ message: "Couldn't find what you were looking for!" })
    }
})

app.listen(PORT, (req, res) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Listening On PORT ${PORT}`)
    }
})