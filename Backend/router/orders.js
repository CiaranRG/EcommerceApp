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


// router.get('/', async (req, res) => {
//     const { accountId } = req.session
//     try {
//         const result = await db.query('SELECT * FROM orders WHERE accountid = $1', [accountId])
//         // Creating function to map ids into an array
//         const productIds = result.rows.map(product => product.id)
//         console.log(productIds)
//         if (productIds.length > 0) {
//             // Grabbing any order item that is linked to our specific order
//             let orderItemResult = await db.query('SELECT * FROM order_item WHERE orderid = ', [productIds])
//             console.log(orderItemResult.rows)
//         } else {
//             console.log('Products not found')
//             res.status(404).json({ data: orderItemResult.rows })
//         }

//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: 'Internal server error' })
//     }
// })

router.get('/', async (req, res) => {
    const { accountId } = req.session;
    try {
        // Grabbing all the orders that correspond to the user currently
        const orderResult = await db.query('SELECT * FROM orders WHERE accountid = $1', [accountId]);
        const orders = orderResult.rows;
        console.log('The orders', orders)

        if (orders.length === 0) {
            return res.status(200).json({ data: [] });
        }

        // Creating an array to hold the final result
        let ordersWithItems = [];

        // Looping through each orderId one by one grabbing all the products for each seperate order
        for (const order of orders) {
            // Fetching the order items for the current order
            const orderItemsResult = await db.query('SELECT * FROM order_item WHERE orderid = $1', [order.id]);
            const orderItems = orderItemsResult.rows;
            // Querying the products database for each productId in the current order
            for (const item of orderItems) {
                const productResult = await db.query('SELECT * FROM product WHERE id = $1', [item.productid]);
                const product = productResult.rows[0];

                // Adding product details to the order item
                item.product = product;
            }

            // Adding the order items to the current order
            order.items = orderItems;
            // Adding the current order with items to the final result
            ordersWithItems.push(order);
        }

        res.status(200).json({ data: ordersWithItems });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export { router as orderRoutes }