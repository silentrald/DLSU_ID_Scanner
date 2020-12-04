const Ajv = require('ajv');
const db = require('../db');
let ajv = new Ajv({
    allErrors: true
});

const ATTENDANCE_PARAM_SCHEMA = 'a';

ajv.addSchema({
    type: 'object',
    properties: {
        eventID: {
            type: 'string',
            maxLength: 11,
            pattern: '^[a-zA-Z0-9]*$' // alphanumeric check
        },
        serialID: {
            type: 'string',
            maxLength: 8,
            minLength: 8,
            pattern: '^[0-9a-f]*$' // hex number check
        }
    },
    required: [ 'eventID', 'serialID' ]
}, ATTENDANCE_PARAM_SCHEMA);

const attendanceMw = {
    /**
     * Validates the event and student id
     */
    validateParamEventAndStudentID: (req, res, next) => {
        const valid = ajv.validate(ATTENDANCE_PARAM_SCHEMA, req.params);

        if (!valid) {
            console.log(ajv.errors);
            // TODO: edit error message
            return res.status(400).send({ errMsg: ajv.errorsText() });
        }

        next();
    },

    /**
     * Check if the checker/organizer is assigned to event 
     */
    checkAssignments: async (req, res, next) => {
        const { eventID } = req.params;

        try {
            const queryAssignment = {
                text: `
                    SELECT  *
                    FROM    assignments
                    WHERE   user_id = $1
                        AND event_id = $2
                    LIMIT   1;
                `,
                values: [ req.user.userID, eventID ]
            };

            const { rowCount } = await db.query(queryAssignment);
            if (rowCount < 1) {
                return res.status(403).send({ errMsg: 'You\'re not a checker in this event' });
            }
            
            next();
        } catch (err) {
            console.log(err);
            
            return res.status(500).end();
        }
    }
};

module.exports = attendanceMw;