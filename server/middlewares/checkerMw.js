const db = require('../db');

const checkerMw = {
    /**
     * Validate if the checker account is under the organizer
     */
    isOrganizerAssigned: async (req, res, next) => {
        const { userID } = req.params;

        try {
            const queryCheckerUser = {
                text: `
                    SELECT  *
                    FROM    checker_users
                    WHERE   user_id = $1
                        AND organizer_assigned = $2
                    LIMIT   1;
                `,
                values: [
                    userID,
                    req.user.userID
                ]
            };

            const resultCheckerUser = await db.query(queryCheckerUser);
            if (resultCheckerUser.rowCount < 1) {
                return res.status(403).send({ errMsg: 'Checker is not under you' });
            }

            next();
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    },
};

module.exports = checkerMw;