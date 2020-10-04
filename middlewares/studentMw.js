const Ajv = require('ajv');
let ajv = new Ajv({
    allErrors: true
});

const STUDENT_BODY_SCHEMA = 'a';

ajv.addSchema({
    type: 'object',
    properties: {
        serialID: {
            type: 'string',
            maxLength: 8,
            minLength: 8,
            pattern: "^[0-9a-f]*$",
        },
        fname: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
        },
        lname: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
        },
    },
    required: [
        'serialID',
        'fname',
        'lname'
    ]
}, STUDENT_BODY_SCHEMA);

const studentMw = {
    /**
     * Validates the student info passed in the body
     * properties: serialID, fname, lname
     */
    validateStudentInfo: (req, res, next) => {
        const valid = ajv.validate(STUDENT_BODY_SCHEMA, req.body);

        if (!valid) {
            console.log(ajv.errorsText());
            console.log(ajv.errors);
            // TODO: Clean the ajv error
            return res.status(403).send({ error: ajv.errors });
        }

        next();
    },

    
};

module.exports = studentMw;