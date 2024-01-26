import express from 'express';
import { config } from 'dotenv';
import db from '../utils/databaseConnection.js';

// Importing bcrypt to hash password and setting up our salt rounds
// import bcrypt from 'bcryptjs'
const saltRounds = 14;

const router = express.Router();

router.post('/', (req, res) => {
    console.log('Received Account Creation Request!')
    const {email, username, password } = req.body
    const formData = ({email, username, password})
    try {
        console.log('Try account creation')
        res.status(201).json({message: 'Everything worked!'})
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
    } catch (error){
        console.log('Hit error on account Login')
        console.log(error)
    }
})

export { router as accountRoutes }