import express from 'express';
import db from '../utils/databaseConnection.js';

const router = express.Router();

router.get('/products', async (req, res) => {
    // Grabbing the variables we sent from the frontend
    const { demographic, category } = req.query
    console.log(demographic, category)
    try {
        const categoryId = await db.query(`SELECT * FROM category WHERE name = $1`, [category])
        console.log(categoryId)
        // const products = await db.query(`SELECT * FROM product WHERE demographic = $1, category = `)
        res.status(201).json({message: 'heres what we got', catergoryId: categoryId})
    } catch (err){
        console.log(err)
        res.status(400).json({message: 'There was an error getting products', error: err})
    }
})

export { router as productRoutes }