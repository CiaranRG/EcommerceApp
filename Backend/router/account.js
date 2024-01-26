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
    } catch (error){
        console.log('Hit error on account creation')
        console.log(error)
    }
})

router.post('/login', async (req, res) => {
    console.log('Received Account Login Request!')
    const loginAccount = req.body
    try {
        console.log('Try account Login')
        const user = await db.query('SELECT * FROM users WHERE username = $1', [username])
        if (user.rows.length === 0 ){
            throw new Error('User Not Found')
        }
        const comparedPassword = bcrypt.compare(loginAccount.password, user.hash)
        if (comparedPassword){

        }   
        // Send message to front end and create a session for them
        res.status(201).json({message: 'Everything worked!'})
    } catch (err){
        if (err.message === 'User Not Found'){
            res.status(404).json({message: err.message})
        }
        console.log('Hit error on account Login')
        console.log(err)
    }
})

export { router as accountRoutes }