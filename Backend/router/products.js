import express from 'express';
import db from '../utils/databaseConnection.js';

const router = express.Router();

router.get('/products', async (req, res) => {
    // Grabbing the variables we sent from the frontend
    const { demographic, category } = req.query
    try {
        // const result
    } catch (err){

    }
})

export { router as productRoutes }