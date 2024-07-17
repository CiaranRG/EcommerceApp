import express from 'express';
import db from '../utils/databaseConnection.js';
import { rmSync } from 'fs';

const router = express.Router();

router.post('/create', async (req, res) => {
    const { accountId } = req.session
    const { cart } = req.body
    // Mapping over the cart and grabbing just the ids and quantites
    const cartItems = cart.map(product => ({
        productid: product.productid,
        quantity: product.quantity,
    }));
    console.log(cartItems)
    try {
        // Create a new order in the orders tables
        console.log('Entering order creation')
        db.query('BEGIN')
        const result = await db.query('INSERT INTO orders (accountid) VALUES ($1) RETURNING id', [accountId])
        // Add products to the order table and attach the orderId to each product
        for (let item of cartItems) {
            await db.query('INSERT INTO order_item (orderid, productid, quantity) VALUES ($1, $2, $3)', [result.rows[0].id, item.productid, item.quantity])
        }
        // If successful remove those products from the users current cart
        res.status(200).json({ message: 'Order was created successfully' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error' })
    }
})


router.get('/', async (req, res) => {

})

export { router as orderRoutes }