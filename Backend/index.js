import express from "express";
import session from "express-session";
import cors from 'cors';
import { config } from 'dotenv'
import connectPgSimple from 'connect-pg-simple';
import db from "./utils/databaseConnection.js";
import cookieParser from "cookie-parser";

// Importing our routes
import { accountRoutes } from "./router/account.js";
import { productRoutes } from "./router/products.js";

// Loading the .env file
config()

const app = express()
const PORT = 5000

// We use this to allow connect-pg access to session so it can extend its use with our database
const pgSessions = connectPgSimple(session)

// Adding in origin to allow requests from the frontend and also setting credentials to true for user authentication through cookies
app.use(
    cors(
        { origin: 'http://localhost:5173', credentials: true }
    )
);

app.use(express.json());
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
        // This will be true in production meaning we only send cookies over https and not http
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: 14 * 24 * 60 * 60 * 1000,
    }
}))
// Add this in so we can use the cookies on the backend
app.use(cookieParser())

// Telling the app to use the cors middleware for all the preflight requests
app.options('/api/accounts/login', cors());

// Telling my app to use these files for requests
app.use('/accounts', accountRoutes);
app.use('/products', productRoutes);


app.get('/', (req, res) => {
    try {
        res.status(200).json({ message: "We found what you were looking for!" })
    } catch (err) {
        res.status(404).json({ message: "Couldn't find what you were looking for!" })
    }
})

app.listen(PORT, (req, res) => {
    console.log(`Listening On PORT ${PORT}`)
})