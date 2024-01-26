import express  from "express";
import cors from 'cors'
import { accountRoutes } from "./router/account.js";
// Importing needed modules for sessions
import session from "express-session";
import redis from 'redis'
import connectRedis from "connect-redis";

const RedisStore = connectRedis(session);
const redisClient = redis.createClient({

})

const app = express()
const PORT = 5000

// Adding in origin to allow requests from the frontend and also setting credentials to true for user authentication through cookies
app.use(
    cors(
        {origin: 'http://localhost:5173', credentials: true}
    )
);

app.use(express.json());

// Setting the session middleware
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'your_secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    }
}));

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