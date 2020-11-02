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
        const { eventID, userID } = req.params;
        
        try {
            const queryInsAssignment = {
                text: `
                    INSERT INTO assignments(user_id, event_id)
                        VALUES($1, $2);
                `,
                values: [ userID, eventID ]
            };

            await db.query(queryInsAssignment);
            return res.status(201).send({ msg: 'Checker was assigned to the event' });
        } catch (err) {
            
            // TODO: if user is already assigned to the event
            const queryCheckAssignment = {
                text: `
                    SELECT *
                    FROM assignments
                    WHERE user_id = $1
                        AND event_id = $2
                `,
                values: [ userID, eventID ]
            };

            const { rowCount } = await db.query(queryCheckAssignment);

            if (rowCount == 1) {
                return res.status(403).send({ errMsg: 'Checker is already assigned to the event' });
            }

            return res.status(500).end();
        }
    },

};

module.exports = assignmentAPI;