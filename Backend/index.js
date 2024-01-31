import express  from "express";
import session from "express-session";
import cors from 'cors';
import { accountRoutes } from "./router/account.js";
import connectPgSimple from 'connect-pg-simple';

const app = express()
const PORT = 5000

const pgSessions = connectPgSimple(session)

// Adding in origin to allow requests from the frontend and also setting credentials to true for user authentication through cookies
app.use(
    cors(
        {origin: 'http://127.0.0.1:5173', credentials: true}
    )
);

app.use(express.json());
app.use(session({
        name: 'session',
        // Setting up a new pgSession to handle session storage
        store: new pgSessions({
            // Create a new pool
            pool: new Pool({
                // We pass in our data from the .env file
                user: process.env.PG_USER,
                host: 'localhost',
                database: process.env.PG_DATBASE,
                password: process.env.PG_PASS,
                port: 5432,
            }),
            // We can use a custom table within our postgres database to store the sessions
            // tableName: 'session'
        }),
        secret: 'your_secret',
        saveUninitialized: true,
        resave: false,
        cookie: {
            httpOnly: true,
            // This will be true in production meaning we only send cookies over https and not http
            secure: process.env.NODE_ENV === 'production',
        }
    }))


// Setting the session middleware
// app.use(session({
//     // store: new RedisStore({ client: redisClient }),
//     secret: 'your_secret',
//     saveUninitialized: false,
//     resave: false,
//     cookie: {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//     }
// }));

// Telling the app to use the cors middleware for all the preflight requests
app.options('/api/accounts/login', cors());

// Telling my app to use this file for requests to /api/accounts
app.use('/accounts', accountRoutes);

app.get('/', (req, res) => {
    try {
        res.status(200).json({message: "We found what you were looking for!"})
    } catch (err) {
        res.status(404).json({message: "Couldn't find what you were looking for!"})
    }
})

app.listen(PORT, (req, res) => {
    console.log(`Listening On PORT ${PORT}`)
})