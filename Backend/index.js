import express  from "express";
import cors from 'cors'
import { config } from 'dotenv';

// Importing our database connection
import db from './utils/databaseConnection.js'

const app = express()
const PORT = 5000

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