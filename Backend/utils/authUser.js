// middleware/auth.js
export const authUser = (req, res, next) => {
    if (req.session.accountId) {
        return next();
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};