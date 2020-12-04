const Ajv = require('ajv');
let ajv = new Ajv({
    allErrors: true,
    coerceTypes: true 
});
// const db = require('../db');

const EVENT_CHECKER_ID_PARAMS_SCHEMA = 'a';

ajv.addSchema({
    type: 'object',
    properties: {
        eventID: {
            type: 'string',
            maxLength: 11,
            pattern: '^[a-zA-Z0-9]*$',
        },
        userID: {
            type: 'integer',
        }
    },
    required: [ 'eventID', 'userID' ]
}, EVENT_CHECKER_ID_PARAMS_SCHEMA);

const assignmentMw = {
    /**
     * Validate if event and user id in the
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
};

module.exports = assignmentMw;