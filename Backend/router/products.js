import express from 'express';
import db from '../utils/databaseConnection.js';

const router = express.Router();

router.get('/products/getProduct', async (req, res) => {
    console.log('Entering gather product backend')
    const { id } = req.query
    try {
        console.log('Entering try catch')
        const product = await db.query('SELECT * FROM product WHERE id = $1', [id])
        if (product.rows.length === 0) {
            return res.status(404).json({ message: 'No product was found' });
        }
        console.log('Product was found')
        res.status(200).json(product.rows[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'There was an error getting the product', error: err.message });
    }
})

router.get('/', async (req, res) => {
    const { demographic, category } = req.query;
    console.log('Requested:', { demographic, category });

    try {
        // Grabbing the category ID from the category name
        const categoryRes = await db.query(`SELECT id FROM category WHERE name = $1`, [category]);
        if (categoryRes.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const categoryId = categoryRes.rows[0].id;

        // Then, use the category ID to find products
        const products = await db.query(`SELECT * FROM product WHERE categoryid = $1 AND demographic = $2`, [categoryId, demographic]);
        console.log('Products found');

        res.status(200).json(products.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'There was an error getting products', error: err.message });
    }
});

export { router as productRoutes };
