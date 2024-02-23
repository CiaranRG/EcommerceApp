import express from 'express';
import db from '../utils/databaseConnection.js';
import { loginSchema, registerSchema } from '../models/accountModel.js'

// Importing bcrypt to hash password and setting up our salt rounds
import bcrypt from 'bcryptjs'
const saltRounds = 14;

const router = express.Router();

router.post('/isLoggedIn', (req, res) => {
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
        res.status(201).json({ message: 'Data Submitted!' })
    } catch (error) {
        if (err.message === 'Validation error') {
            console.error(err);
            res.status(400).json({ message: 'Validation error' });
        }
        console.log('Hit error on account creation')
        console.log(error)
        res.status(400).json({ message: 'Registration error' })
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
        res.status(201).json({ message: 'User logged in and a session has been created' })
    } catch (err) {
        if (err.message === 'Login error') {
            console.error(err);
            res.status(400).json({ message: 'Validation error' });
        }
        console.log('Hit error on account Login')
        console.log(err)
    }
})

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
        res.json({ message: "Successfully logged out" });
    })
})

export { router as accountRoutes }