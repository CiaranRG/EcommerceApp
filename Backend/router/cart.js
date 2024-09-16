import express from 'express';
import Stripe from 'stripe';
import db from '../utils/databaseConnection.js';
import { authUser } from '../utils/authUser.js';
import grabAccountIds from '../utils/grabAccountIds.js';

import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the .env file
const envPath = join(__dirname, '..', '.env');
config({ path: envPath });

// Calling this to have its side effects happen (reading the .env and parsing the data)
config()

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY, { apiVersion: '2024-06-20' });

router.post('/remove', authUser, async (req, res) => {
    let cartId, accountId
    const { productId } = req.body;
    const ids = await grabAccountIds(req, db)
    cartId = ids.cartId
    accountId = ids.accountId

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


router.post('/add', authUser, async (req, res) => {
    // Defining variables to be used outwith the scope below
    let cartId, accountId
    const { productId } = req.body
    const ids = await grabAccountIds(req, db)
    cartId = ids.cartId
    accountId = ids.accountId
    if (!accountId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
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

router.post('/clear', authUser, async (req, res) => {
    const { cartId, accountId } = req.session

    try {
        await db.query('DELETE FROM cart_item WHERE cartid = $1', [cartId])
        res.status(200).json({ message: 'Cart cleared' })
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Error on cart clear')
            console.log(err)
        }
        res.status(500).json({ message: 'Internal server error' })
    }
})

router.post('/payment', authUser, async (req, res) => {
    const { totalAmount } = req.body;
    try {
        // Creating a payment intent with the correct currency/method and amount
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100,
            currency: 'usd',
            payment_method_types: ['card']
        })
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Error creating payment intent')
            console.log(err)
        }
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/', authUser, async (req, res) => {
    const { cartId } = req.session;
    try {
        // Fetching the cart items including the quantity
        const cartItemsResult = await db.query(`
            SELECT ci.productid, ci.quantity, p.name, p.price, p.stock, p.description, p.imageurl 
            FROM cart_item ci
            JOIN product p ON ci.productid = p.id
            WHERE ci.cartid = $1
        `, [cartId]);

        res.status(200).json({ data: cartItemsResult.rows });
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(err);
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/getDataIOS', authUser, async (req, res) => {
    const { session } = req.body
    const result = await db.query(
        'SELECT sess->>\'cartId\' AS cartId FROM session WHERE sid = $1',
        [session]
    );
    const cartId = result.rows[0].cartid
    try {
        // Fetching the cart items including the quantity
        const cartItemsResult = await db.query(`
            SELECT ci.productid, ci.quantity, p.name, p.price, p.stock, p.description, p.imageurl 
            FROM cart_item ci
            JOIN product p ON ci.productid = p.id
            WHERE ci.cartid = $1
        `, [cartId]);

        res.status(200).json({ data: cartItemsResult.rows });
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(err);
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});



export { router as cartRoutes }  