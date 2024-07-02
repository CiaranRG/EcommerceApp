import Joi from 'joi'

// Creating Joi schema to check against on account registration
const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
})

// Creating a Joi schema for logging in
const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().required(),
});

export { loginSchema, registerSchema }

