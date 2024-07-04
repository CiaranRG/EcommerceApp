import express from 'express';
import db from '../utils/databaseConnection.js';
import { loginSchema, registerSchema, addressSchema } from '../models/accountModel.js'

// Importing bcrypt to hash password and setting up our salt rounds
import bcrypt from 'bcryptjs'
const saltRounds = 14;

const router = express.Router();

// Routes for managing accounts like editing things

router.post('/changeUsername', async (req, res) => {
    const usernameDetails = req.body
    const usernameValidationSchema = registerSchema.extract('username');
    try {
        const { error } = usernameValidationSchema.validate(usernameDetails.username);
        if (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Username validation failed');
            }
            throw { type: 'validation', message: 'Username validation failed', details: error.details };
        }
        await db.query('UPDATE account SET username = $1 WHERE accountId = $2', [usernameDetails.username, usernameDetails.accountId])
        res.status(200).json({ message: 'Username has been updated in the database' })
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(err)
        }
        res.status(500).json({ message: 'Internal server error' })
    }
})

router.post('/changeEmail', async (req, res) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Starting the proccess of changing an email')
    }
    const emailDetails = req.body
    const emailValidationSchema = registerSchema.extract('email');
    try {
        const { error } = emailValidationSchema.validate(emailDetails.email);
        if (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Email validation failed');
            }
            throw { type: 'validation', message: 'Email validation failed', details: error.details };
        }
        await db.query('UPDATE account SET email = $1 WHERE accountId = $2', [emailDetails.email, emailDetails.accountId])
        res.status(200).json({ message: 'Email has been updated in the database' })
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(err)
        }
        res.status(500).json({ message: 'Internal server error' })
    }
})

router.post('/changePassword', async (req, res) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Starting the process of changing a password');
    }
    const passwordDetails = req.body;
    const passwordValidationSchema = registerSchema.extract('password');
    try {
        if (process.env.NODE_ENV !== 'production') {
            console.log('entered try block')
            console.log('Validating password');
        }
        const { error } = passwordValidationSchema.validate(passwordDetails.password);
        if (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Password validation failed');
            }
            // Throw an object with type 'validation' to distinguish it from other errors
            throw { type: 'validation', message: 'Password validation failed', details: error.details };
        }
        if (process.env.NODE_ENV !== 'production') {
            console.log('Validation passed');
            console.log('Hashing password');
        }
        const hashedPass = await bcrypt.hash(passwordDetails.password, saltRounds);
        if (process.env.NODE_ENV !== 'production') {
            console.log('Password hashed');
        }
        await db.query('UPDATE account SET password = $1 WHERE accountId = $2', [hashedPass, passwordDetails.accountId]);
        res.status(200).json({ message: 'Password has been updated in the database' });
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Hit error on password change');
            console.log(err);
        }
        if (err.type && err.type === 'validation') {
            // Respond with 400 for validation errors
            res.status(400).json({ message: err.message, details: err.details });
        } else {
            // Respond with 500 for all other errors
            res.status(500).json({ message: 'Internal server error' });
        }
    }
})


router.post('/changeAddress', async (req, res) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Starting the process of changing an address');
    }
    const addressDetails = req.body;
    console.log(addressDetails)
    try {
        const { error } = addressSchema.validate(addressDetails);
        if (error) {
            console.log('Address validation failed', error);
            throw { type: 'validation', message: 'Address validation failed', details: error.details };
        }

        const query = `
            INSERT INTO shipping_address (account_id, address_line1, address_line2, city, state, postal_code, country, phone_number)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (account_id) 
            DO UPDATE SET 
                address_line1 = EXCLUDED.address_line1,
                address_line2 = EXCLUDED.address_line2,
                city = EXCLUDED.city,
                state = EXCLUDED.state,
                postal_code = EXCLUDED.postal_code,
                country = EXCLUDED.country,
                phone_number = EXCLUDED.phone_number;
        `;

        await db.query(query, [
            addressDetails.accountId,
            addressDetails.addressLine1,
            addressDetails.addressLine2,
            addressDetails.city,
            addressDetails.state,
            addressDetails.postal_code,
            addressDetails.country,
            addressDetails.phone_number
        ]);

        res.status(200).json({ message: 'Address has been updated in the database' });
    } catch (err) {
        console.log('Error updating address:', err);
        if (err.type && err.type === 'validation') {
            res.status(400).json({ message: err.message, details: err.details });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});


router.post('/', async (req, res) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Starting the process of creating an account');
    }
    const newAccount = req.body
    try {
        // Destructuring an error if there is any from the validation against our joi register schema
        const { error } = registerSchema.validate(newAccount)
        // If there was an error validating the schema we throw this
        if (error) {
            throw new Error('Validation error')
        }
        // hashing the password on its own and saving it
        const hash = await bcrypt.hash(newAccount.password, saltRounds)
        // Query to the database to insert these values into these columns
        const result = await db.query(
            'INSERT INTO account (email, username, password) VALUES ($1, $2, $3) RETURNING accountid',
            [newAccount.email, newAccount.username, hash]
        )
        // Using the returned accountId from the database to add it to the session
        req.session.accountId = result.rows[0].accountid
        return res.status(201).json({ message: 'Data Submitted!' })
    } catch (err) {
        if (err.message === 'Validation error') {
            console.error(err);
            return res.status(400).json({ message: 'Validation error' });
        }
        if (process.env.NODE_ENV !== 'production') {
            console.log('Hit error on account creation')
            console.log(err)
        }
        return res.status(400).json({ message: 'Registration error' })
    }
})

// Routes for dealing with active accounts but not editing them or deleting them

router.get('/isLoggedIn', (req, res) => {
    // Checking for a cookie called session
    if (!req.cookies.session) {
        // return this if there is no cookie
        return res.status(401).json({ isLoggedIn: false })
    }
    if (!req.session.accountId) {
        // If there's no userID in the session, the user is not authenticated
        return res.status(401).json({ isLoggedIn: false });
    }
    return res.status(200).json({ isLoggedIn: true })
})

router.get('/', async (req, res) => {
    if (!req.session.accountId) {
        return res.status(401).json({ message: "Couldn't find any user's in the session" })
    }
    const accountId = req.session.accountId
    try {
        // Using database alias (a and s in this case) so we can query both databases for the specific information we need.
        const result = await db.query(
            `
            SELECT a.accountid, a.email, a.username, 
                   s.address_line1, s.address_line2, s.city, s.state, s.postal_code, s.country, s.phone_number
            FROM account a
            LEFT JOIN shipping_address s ON a.accountid = s.account_id
            WHERE a.accountid = $1
            `,
            [accountId]
        );
        if (result.rows.length > 0) {
            res.status(200).json({ data: result.rows[0] })
        } else {
            res.status(401).json({ message: 'No Users' })
        }
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(err)
        }
        res.status(500).json({ message: "Database error" })
    }
})

router.post('/login', async (req, res) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Starting the process of logging in')
    }
    const loginAccount = req.body
    try {
        // Destructuring an error if there is any from the validation against our joi register schema
        const { error } = loginSchema.validate(loginAccount)
        // If there was an error validating the schema we throw this
        if (error) {
            throw new Error('Login error')
        }
        const user = await db.query('SELECT * FROM account WHERE username = $1', [loginAccount.username])
        const currentUser = user.rows[0]
        if (user.rows.length === 0) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('User not found')
            }
            return res.status(404).json({ message: 'User not found' })
        }
        const comparedPassword = await bcrypt.compare(loginAccount.password, currentUser.password)
        if (!comparedPassword) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Wrong Password')
            }
            return res.status(401).json({ message: 'Incorrect details' })
        }
        if (process.env.NODE_ENV !== 'production') {
            console.log('Creating user session and assigning id')
        }
        req.session.accountId = user.rows[0].accountid
        // Send message to front end and create a session for them
        return res.status(201).json({ message: 'User logged in and a session has been created' })
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Hit error on account Login')
            console.log(err)
        }
        // This would be considered an axios error on the frontend
        if (err.message === 'Login error') {
            console.error(err);
            return res.status(400).json({ message: 'Validation error' });
        }
    }
})


// Routes for logging out and deletions

router.get('/logout', (req, res) => {
    // Using the destroy function to delete the session from the database
    req.session.destroy((err) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Entering Destroy')
        }
        if (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Session Failed To Destroy')
                console.log(err)
            }
            return res.status(500).json({ message: 'Session Failed To Destroy' })
        }
        // Clearing the cookie called session from the browser
        res.clearCookie('session');
        return res.json({ message: "Successfully logged out" });
    })
})

export { router as accountRoutes }