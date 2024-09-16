const grabAccountIds = async (req, db) => {
    let accountId, cartId;

    if (req.body.session) {
        // iOS session handling
        const { session } = req.body;
        try {
            const result = await db.query(
                'SELECT sess->>\'accountId\' AS accountid, sess->>\'cartId\' AS cartid FROM session WHERE sid = $1',
                [session]
            );

            if (result.rows.length > 0) {
                accountId = result.rows[0].accountid;
                cartId = result.rows[0].cartid;
            }
        } catch (err) {
            console.log('Error fetching session data:', err);
            throw new Error('Failed to fetch session data');
        }
    } else {
        // Non-iOS session handling
        accountId = req.session.accountId;
        cartId = req.session.cartId;
    }

    return { accountId, cartId };
};

export default grabAccountIds;