const Ajv = require('ajv');
const ajv = new Ajv({
    allErrors: true
});
require('ajv-keywords')(ajv, [
    'transform',
]);
const date = require('../modules/date');
const db = require('../db');

const EVENT_ID_PARAMS_SCHEMA = 'a';
const EVENT_INFO_BODY_SCHEMA = 'b';

ajv.addSchema({
    type: 'object',
    properties: {
        eventID: {
            type: 'string',
            maxLength: 11,
            pattern: '^[a-zA-Z0-9]*$',
        }
    },
    required: [ 'eventID' ]
}, EVENT_ID_PARAMS_SCHEMA);

ajv.addSchema({
    type: 'object',
    properties: {
        eventName: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            transform: [ 'trim' ],
        },
        startDate: {
            type: 'string',
            format: 'date'
        },
        endDate: {
            type: 'string',
            format: 'date'
        },
        eventOrg: {
            type: 'string',
            maxLength: 10,
        }
    },
    required: [
        'eventName',
        'startDate',
        'endDate',
        'eventOrg'
    ],
}, EVENT_INFO_BODY_SCHEMA);

const eventMw = {
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
            if (resultEvent.rowCount < 1) {
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

    /**
     * Validates the event id in the request params
     */
    validateEventIDParams: (req, res, next) => {
        const valid = ajv.validate(EVENT_ID_PARAMS_SCHEMA, req.params);

        if (!valid) {
            console.log(ajv.errors);
            return res.status(403).send({ errMsg: 'Invalid event ID' });
        }

        next();
    },

    validateEventInfo: (req, res, next) => {
        const valid = ajv.validate(EVENT_INFO_BODY_SCHEMA, req.body);

        if (!valid) {
            console.log(ajv.errors.map(error => error.message));
            // TODO: clean
            return res.status(403).send({ error: ajv.errors.map(error => error.message) });
        }
        // check if valid dates
        const { startDate, endDate } = req.body;

        if (date.compareToNow(startDate) < 0) {
            return res.status(403).send({ error: 'Start Date should not be a date before today' });
        }

        if (date.compareDates(endDate, startDate) < 0) {
            return res.status(403).send({ error: 'End Date should not be a date before the Start Date' });
        }

        next();
    }
};

module.exports = eventMw;