import express from 'express';
import db from '../utils/databaseConnection.js';
import { loginSchema, registerSchema } from '../models/accountModel.js'

// Importing bcrypt to hash password and setting up our salt rounds
import bcrypt from 'bcryptjs'
const saltRounds = 14;

const router = express.Router();

// Routes for managing accounts like editing things

router.post('/changeUsername', async (req, res) => {
    console.log('Starting the proccess of changing a username')
    const usernameDetails = req.body
    console.log(usernameDetails)
    try {
        await 
        res.status(200).json({message: 'test'})
    } catch (err) {
        console.log(err)
    }
})

router.post('/', async (req, res) => {
    console.log('Received Account Creation Request!')
    const newAccount = req.body
    try {
        // Destructuring an error if there is any from the validation against our joi register schema
        const { error } = registerSchema.validate(newAccount)
        // If there was an error validating the schema we throw this
        if (error) {
            throw new Error('Validation error')
        }
        // hashing the password on its own and saving it
        const hash = await bcrypt.hash(newAccount.password, saltRounds,)
        // Query to the database to insert these values into these columns
        const result = await db.query(
            'INSERT INTO account (email, username, password) VALUES ($1, $2, $3) RETURNING accountid',
            [newAccount.email, newAccount.username, hash]
        )
        // Using the returned accountId from the database to add it to the session
        req.session.accountId = result.rows[0].accountid
        return res.status(201).json({ message: 'Data Submitted!' })
    } catch (err) {
        if (err.message === 'Validation error') {
            console.error(err);
            return res.status(400).json({ message: 'Validation error' });
        }
        console.log('Hit error on account creation')
        console.log(err)
        return res.status(400).json({ message: 'Registration error' })
    }
})

// Routes for dealing with active accounts but not editing them or deleting them

router.get('/isLoggedIn', (req, res) => {
    // Checking for a cookie called session
    if (!req.cookies.session) {
        // return this if there is no cookie
        return res.status(401).json({ isLoggedIn: false })
    }
    if (!req.session.accountId) {
        // If there's no userID in the session, the user is not authenticated
        return res.status(401).json({ isLoggedIn: false });
    }
    return res.status(200).json({ isLoggedIn: true })
})

router.get('/', async (req, res) => {
    if (!req.session.accountId) {
        return res.status(401).json({ message: "Couldn't find any user's in the session" })
    }
    const accountId = req.session.accountId
    console.log('Querying Database')
    try {
        // Using database alias (a and s in this case) so we can query both databases for the specific information we need.
        const result = await db.query(
            `
            SELECT a.accountid, a.email, a.username, 
                   s.address_line1, s.address_line2, s.city, s.state, s.postal_code, s.country, s.phone_number
            FROM account a
            LEFT JOIN shipping_address s ON a.accountid = s.account_id
            WHERE a.accountid = $1
            `,
            [accountId]
        );
        if (result.rows.length > 0) {
            console.log("Sending User Data")
            res.status(200).json({ data: result.rows[0] })
        } else {
            res.status(401).json({ message: 'No Users' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Database error" })
    }
})

router.post('/login', async (req, res) => {
    console.log('Received Account Login Request!')
    const loginAccount = req.body
    try {
        // Destructuring an error if there is any from the validation against our joi register schema
        const { error } = loginSchema.validate(loginAccount)
        // If there was an error validating the schema we throw this
        if (error) {
            throw new Error('Login error')
        }
        const user = await db.query('SELECT * FROM account WHERE username = $1', [loginAccount.username])
        const currentUser = user.rows[0]
        if (user.rows.length === 0) {
            console.log('User not found')
            return res.status(404).json({ message: 'User not found' })
        }
        const comparedPassword = await bcrypt.compare(loginAccount.password, currentUser.password)
        if (!comparedPassword) {
            console.log('Wrong Password')
            return res.status(401).json({ message: 'Incorrect details' })
        }
        console.log('Creating user session and assigning id')
        req.session.accountId = user.rows[0].accountid
        // Send message to front end and create a session for them
        return res.status(201).json({ message: 'User logged in and a session has been created' })
    } catch (err) {
        // This would be considered an axios error on the frontend
        if (err.message === 'Login error') {
            console.error(err);
            return res.status(400).json({ message: 'Validation error' });
        }
        console.log('Hit error on account Login')
        console.log(err)
    }
})


// Routes for logging out and deletions

router.get('/logout', (req, res) => {
    // Using the destroy function to delete the session from the database
    req.session.destroy((err) => {
        console.log('Entering Destroy')
        if (err) {
            console.log(err)
            return res.status(500).json({ message: 'Session Failed To Destroy' })
        }
        // Clearing the cookie called session from the browser
        res.clearCookie('session');
        return res.json({ message: "Successfully logged out" });
    })
})

export { router as accountRoutes }