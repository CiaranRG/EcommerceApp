// middleware/auth.js
export const authUser = async (req, res, next) => {
    if (req.session.accountId) {
        return next();
    }
    // Destructing all possible variations for the session key variable
    const { session, sessionId, sid } = req.body
    // Saving whatever variations it was we sent t this so we are always using sessionKey in the end
    const sessionKey = session || sessionId || sid

    // Check for client-managed session (iOS) using sessionKey from the request body
    if (sessionKey) {
        try {
            // Validate the session ID against the database
            const sessionCheck = await db.query('SELECT * FROM session WHERE sid = $1', [sessionKey]);

            if (sessionCheck.rowCount > 0) {
                // If the session exists, allow the request to proceed
                return next();
            } else {
                // If no matching session is found, respond with unauthorized
                return res.status(401).json({ message: 'Unauthorized: Session not found' });
            }
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Error validating session:', err);
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        // No session found; respond with unauthorized
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
