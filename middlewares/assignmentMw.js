const Ajv = require('ajv');
let ajv = new Ajv({
    allErrors: true
});
const db = require('../db');

const EVENT_CHECKER_ID_PARAMS_SCHEMA = 'a';

ajv.addSchema({
    type: 'object',
    properties: {
        eventID: {
            type: 'string',
            maxLength: 11,
            pattern: '^[a-zA-Z0-9]$',
        },
        checkerID: {
            type: 'integer',
        }
    },
    required: [ 'eventID', 'checkerID' ]
}, EVENT_CHECKER_ID_PARAMS_SCHEMA);

const assignmentMw = {
    /**
     * Validate if event and checker id in the
     * request body is in a valid format
     */
    validateEventAndCheckerID: (req, res, next) => {
        const valid = ajv.validate(EVENT_CHECKER_ID_PARAMS_SCHEMA, req.params);

        if (!valid) {
            console.log(ajv.errors);
            // TODO: clean errors
            return res.status(403).send({ error: ajv.errors });
        }

        next();
    },

    /**
     * Check if the organizer account is the one
     * who made the event
     */
    isEventOrganizer: async (req, res, next) => {
        const { eventID } = req.params;

        try {
            const queryEvent = {
                text: `
                    SELECT  organizer_id
                    FROM    events
                    WHERE   event_id = $1;
                `,
                values: [ eventID ]
            };

            const resultEvent = await db.query(queryEvent);
            if (resultEvent.rowCount === 0) {
                return res.status(403).send({ errMsg: 'Event does not exist' });
            }

            if (resultEvent.rows[0].organizer_id !== req.user.userID) {
                return res.status(403).send({ errMsg: 'You\'re not the organizer of the event' });
            }

            next();
        } catch (err) {
            console.log(err);

            return res.status(500).end();
        }
    },
};

module.exports = assignmentMw;