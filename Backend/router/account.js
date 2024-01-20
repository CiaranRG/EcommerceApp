import express from 'express';
import { config } from 'dotenv';
import db from '../utils/databaseConnection.js';

// Importing bcrypt to hash password and setting up our salt rounds
import bcrypt from 'bcryptjs'
const saltRounds = 14;

const router = express.Router();

router.post('/', async (req, res) => {
    console.log('Received Account Creation Request!')
    const newAccount = req.body
    try {
        console.log('Try account creation')
        // If there was an error validation the scheme we throw this
        // if (error){
        //     throw new Error('Validation Error')
        // }
        // hashing the password on its own and saving it
        const hash = await bcrypt.hash(newAccount.password, saltRounds,)

        // Query to the database to insert these values into these columns
        const result = await db.query(
            'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING userId',
            [newAccount.email, newAccount.username, hash]
        )
        console.log('Account Created!')
        res.status(201).json({message: 'Data Submitted!'})
    } catch (err){
        console.log('Hit error on account creation')
        console.log(err)
    }
})

router.post('/login', (req, res) => {
    console.log('Received Account Login Request!')
    const {email, username, password } = req.body
    const formData = ({email, username, password})
    try {
        console.log('Try account Login')
        res.status(201).json({message: 'Everything worked!'})
    } catch (err){
        console.log('Hit error on account Login')
        console.log(err)
    }
})

export { router as accountRoutes }