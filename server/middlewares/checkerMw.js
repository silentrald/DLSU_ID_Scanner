const db = require('../db');

const checkerMw = {

    //Check if checker ID and organizer ID exists, and if the checker user is under the logged organizer
    validateTransfer:  async (req, res, next) => {
        const { checkerID, organizerID } = req.params;

        try {
            const queryChecker = {
                text: `
                    SELECT  *
                    FROM    users
                    WHERE   user_id = $1
                        AND access = 'c'
                    LIMIT   1;
                `,
                values: [ checkerID ]
            };
            const { rowCount } = await db.query(queryChecker);

            if (rowCount < 1) {
                return res.status(403).send({ errMsg: 'Checker User does not exist' });
            }

            const queryUnderOrganizer = {
                text: `
                SELECT  *
                FROM    checker_users
                WHERE   user_id = $1
                AND organizer_assigned = $2
                LIMIT   1;
                `,
                values: [ checkerID, organizerID ]
            };
            const resultUnder = await db.query(queryUnderOrganizer);

            if (resultUnder.rowCount == 1) {
                return res.status(400).send({ errMsg: 'Checker user is not under you' });
            }

            const queryOrganizer = {
                text: `
                    SELECT  *
                    FROM    users
                    WHERE   user_id = $1
                        AND access = 'o'
                    LIMIT   1;
                `,
                values: [ organizerID ]
            };
            const result = await db.query(queryOrganizer);

            if (result.rowCount < 1) {
                return res.status(400).send({ errMsg: 'Organizer User does not exist' });
            }

            if (result.rows[0].user_id == req.user.userID ) {
                return res.status(400).send({ errMsg: 'Cannot assign to yourself again' });
            }

            const queryAlreadyOrganizer = {
                text: `
                SELECT  *
                FROM    checker_users
                WHERE   user_id = $1
                AND organizer_assigned = $2
                LIMIT   1;
                `,
                values: [ checkerID, organizerID ]
            };
            const resultO = await db.query(queryAlreadyOrganizer);

            if (resultO.rowCount == 1) {
                return res.status(400).send({ errMsg: 'Checker user is already under that organizer' });
            }

            next();
        }
        catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    }
};

module.exports = checkerMw;