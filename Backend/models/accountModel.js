import Joi from 'joi'

// Creating Joi schema to check against on account registration
const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().label('Username'),
    password: Joi.string().min(3).max(30).required().label('Password'),
    email: Joi.string().email().required().label('Email'),
    isIOS: Joi.boolean().optional(),
})

// Creating a Joi schema for logging in
const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().label('Username'),
    password: Joi.string().required().label('Password'),
    isIOS: Joi.boolean().optional(),
});

const addressSchema = Joi.object({
    addressLine1: Joi.string().required().label('Address Line 1'),
    addressLine2: Joi.string().allow('').optional().label('Address Line 2'),
    city: Joi.string().required().label('City'),
    state: Joi.string().required().label('State'),
    postal_code: Joi.string().required().label('Postal Code'),
    country: Joi.string().required().label('Country'),
    phone_number: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required().label('Phone Number'),
    isIOS: Joi.boolean().optional(),
})

export { loginSchema, registerSchema, addressSchema }

