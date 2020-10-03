const db = require('../db');

const assignmentAPI = {
    // POST
    // TODO: Change the name
    postAllAssignments: async (req, res) => {
        try {
            const queryAssignments = {
                text: `
                    SELECT  event_id, event_name
                    FROM    events
                    WHERE   event_id IN (
                        SELECT  event_id
                        FROM    assignments
                        WHERE   checker_id = $1
                    );
                `,
                values: [ req.user.userId ]
            };

            const resultAssignments = db.query(queryAssignments)
                .then(result => {
                    return res.status(200).send({ events: result.rows });
                })
        } catch (err) {
            if (!err) return;
        
            console.log(err);
            res.status(403).send({ errMsg: 'Unauthorized Access' });
        }
    },
};

module.exports = assignmentAPI;