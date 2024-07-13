import express from 'express';
import db from '../utils/databaseConnection.js';

const router = express.Router();

router.post('/add', async (req, res) => {
    const { cartId, accountId } = req.session
    const { productId } = req.body;
    console.log('Grabbing cartDetails')
    if (!accountId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        console.log('Checking if item is in cart already')
        const result = await db.query('SELECT * FROM cart_item WHERE cartid = $1 AND productid = $2', [cartId, productId])

        if (result.rows.length > 0) {
            // If the product is already in the cart, increment the quantity
            await db.query(
                'UPDATE cart_item SET quantity = quantity + 1 WHERE cartid = $1 AND productid = $2',
                [cartId, productId]
            );
        } else {
            // If the product is not in the cart, insert a new row
            await db.query(
                'INSERT INTO cart_item (cartid, productid, quantity) VALUES ($1, $2, 1)',
                [cartId, productId]
            );
        }
        res.status(200).json({ message: 'Item added to the cart' })
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(err);
        }
    }
});

export { router as cartRoutes }  