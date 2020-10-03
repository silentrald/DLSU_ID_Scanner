const Ajv = require('ajv');
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
            pattern: "^[a-zA-Z0-9]*$" // alphanumeric check
        },
        serialID: {
            type: 'string',
            maxLength: 8,
            minLength: 8,
            pattern: "^[0-9a-f]*$" // hex number check
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
};

module.exports = attendanceMw;