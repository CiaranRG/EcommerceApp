import express from 'express';
import db from '../utils/databaseConnection.js';

const router = express.Router();

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
        console.log('Products found:', products.rows);

        res.status(200).json(products.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'There was an error getting products', error: err.message });
    }
});

export { router as productRoutes };
