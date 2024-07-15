import express from 'express';
import db from '../utils/databaseConnection.js';

const router = express.Router();

router.post('/remove', async (req, res) => {
    const { cartId, accountId } = req.session;
    const { productId } = req.body;

    if (!accountId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        // Check if the item is in the cart
        const result = await db.query('SELECT * FROM cart_item WHERE cartid = $1 AND productid = $2', [cartId, productId]);

        if (result.rows.length > 0) {
            if (result.rows[0].quantity > 1) {
                // Reduce the quantity by 1
                await db.query(
                    'UPDATE cart_item SET quantity = quantity - 1 WHERE cartid = $1 AND productid = $2',
                    [cartId, productId]
                );
            } else {
                // Remove the item from the cart
                await db.query(
                    'DELETE FROM cart_item WHERE cartid = $1 AND productid = $2',
                    [cartId, productId]
                );
            }
            return res.status(200).json({ message: 'Item removed from cart' });
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(err);
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
});


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

router.get('/', async (req, res) => {
    const { cartId } = req.session;
    console.log(cartId)
    try {
        // Fetching the cart items including the quantity
        const cartItemsResult = await db.query(`
            SELECT ci.productid, ci.quantity, p.name, p.price, p.stock, p.description, p.imageurl 
            FROM cart_item ci
            JOIN product p ON ci.productid = p.id
            WHERE ci.cartid = $1
        `, [cartId]);

        console.log(cartItemsResult.rows);

        res.status(200).json({ data: cartItemsResult.rows });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export { router as cartRoutes }  