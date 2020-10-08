const db = require('../db');

const {
    CHECKER
} = require('../constant').ACCESS;

const assignmentAPI = {
    // GET
    getAllAssignments: async (req, res) => {
        const { userID } = req.params;

        if (parseInt(userID) !== req.user.userID) {
            return res.status(403).send({ errMsg: 'Forbidden' });
        }

        try {
            const queryAssignments = {
                text: `
                    SELECT  event_id, event_name
                    FROM    events
                    WHERE   event_id IN (
                        SELECT  event_id
                        FROM    assignments
                        WHERE   user_id = $1
                    );
                `,
                values: [ userID ]
            };

            const resultAssignments = await db.query(queryAssignments);
            return res.status(200).send({ events: resultAssignments.rows });
        } catch (err) {
            if (!err) return;
        
            console.log(err);
            res.status(403).send({ errMsg: 'Unauthorized Access' });
        }
    },

    // POST
    postAssignChecker: async (req, res) => {
        const { eventID, userID } = req.body;

        try {
            const queryInsAssignment = {
                text: `
                    INSERT INTO assignments(event_id, user_id)
                        VALUES($1, $2);
                `,
                values: [ eventID, userID ]
            };

            await db.query(queryInsAssignment);
            return res.status(201).send({ msg: 'Checker was assigned to the event' });
        } catch (err) {
            console.log(err);

            // TODO: if user_id is not in the users table

            // TODO: if user is already assigned to the event
            // return res.status(403).send({ errMsg: 'Checker is already assigned to the event' });

            return res.status(500).end();
        }
    },

};

module.exports = assignmentAPI;