import express from 'express';
import db from '../utils/databaseConnection.js';
import { authUser } from '../utils/authUser.js';

const router = express.Router();

router.get('/getProduct', async (req, res) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Entering gather product backend')
    }
    const { id } = req.query
    if (process.env.NODE_ENV !== 'production') {
        console.log('Product ID from query:', id);
    }
    try {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Entering try catch')
        }
        const product = await db.query('SELECT * FROM product WHERE id = $1', [id])
        if (product.rows.length === 0) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('No product was found');
            }
            return res.status(404).json({ message: 'No product was found' });
        }
        if (process.env.NODE_ENV !== 'production') {
            console.log('Product was found:', product.rows[0]);
        }
        res.status(200).json(product.rows[0]);
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Database error:', err);
        }
        res.status(500).json({ message: 'There was an error getting the product', error: err.message });
    }
})

router.get('/', async (req, res) => {
    const { demographic, category } = req.query;
    if (process.env.NODE_ENV !== 'production') {
        console.log('Requested:', { demographic, category });
    }

    try {
        // Grabbing the category ID from the category name
        const categoryRes = await db.query(`SELECT id FROM category WHERE name = $1`, [category]);
        if (categoryRes.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const categoryId = categoryRes.rows[0].id;

        // Then, use the category ID to find products
        const products = await db.query(`SELECT * FROM product WHERE categoryid = $1 AND demographic = $2`, [categoryId, demographic]);
        if (process.env.NODE_ENV !== 'production') {
            console.log('Products found');
        }
        res.status(200).json(products.rows);
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Database error:', err);
        }
        res.status(500).json({ message: 'There was an error getting products', error: err.message });
    }
});


router.get('/getProductsCart', authUser, async (req, res) => {
    const ids = req.query.ids.split(',').map(Number);
    try {
        const result = await db.query('SELECT * FROM product WHERE id = ANY($1::int[])', [ids]);
        res.status(200).json(result.rows);
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(err)
        }
        res.status(500).json({ message: 'There was an error getting products from the cart', error: err.message });
    }
})

export { router as productRoutes };
