const Ajv = require('ajv');
let ajv = new Ajv({
    allErrors: true
});
require('ajv-keywords')(ajv, ['transform']);

const STUDENT_BODY_SCHEMA = 'a';
const SERIAL_ID_PARAM_SCHEMA = 'b';
const STUDENT_EDIT_BODY_SCHEMA = 'c';

ajv.addSchema({
    type: 'object',
    properties: {
        serialID: {
            type: 'string',
            maxLength: 8,
            minLength: 8,
            pattern: '^[0-9a-f]*$',
        },
        studentID: {
            type: 'integer',
            minimum: 10000000,
            maximum: 99999999,
        },
        fname: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            transform: [ 'trim' ],
        },
        lname: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            transform: [ 'trim' ],
        },
    },
    required: [
        'serialID',
        'studentID',
        'fname',
        'lname'
    ]
}, STUDENT_BODY_SCHEMA);

ajv.addSchema({
    type: 'object',
    properties: {
        serialID: {
            type: 'string',
            maxLength: 8,
            minLength: 8,
            pattern: '^[0-9a-f]*$',
        }
    },
    required: [ 'serialID' ],
}, SERIAL_ID_PARAM_SCHEMA);

ajv.addSchema({
    type: 'object',
    properties: {
        fname: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            transform: [ 'trim' ],
        },
        lname: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            transform: [ 'trim' ]
        },
    },
    required: [
        'fname',
        'lname',
    ]
}, STUDENT_EDIT_BODY_SCHEMA)

//Checker for valid DLSU ID
const validateID = studentID => {
    let accumulator = 0;
    for (let i = 1; i < 9; i++) {
        accumulator += studentID % 10 * i;
        accumulator %= 11;
        studentID = Math.floor(studentID / 10)
    }
    return accumulator === 0;
};

const studentMw = {
    /**
     * Validates the student info passed in the body
     * properties: serialID, fname, lname
     */
    validateStudentInfo: (req, res, next) => {
        const valid = ajv.validate(STUDENT_BODY_SCHEMA, req.body);

        if (!valid) {
            console.log(ajv.errors);
            // TODO: Clean the ajv error
            return res.status(403).send({ error: ajv.errors });
            
        } 

        //Check studentID 
        if (!validateID(req.body.studentID)) {
            console.log("Invalid student ID");
            return res.status(403).send({ error: "Invalid student ID" });
        }

        next();
    },

    /**
     * Validates the student serial id in req.params
     * properties: serialID
     */
    validateParamSerialID: (req, res, next) => {
        const valid = ajv.validate(SERIAL_ID_PARAM_SCHEMA, req.params);

        if (!valid) {
            console.log(ajv.errors);
            return res.status(403).send({ error: 'Invalid ID' });
        }

        next();
    },

    /**
     * Validates the student edit info
     * properties: fname, lname
     */
    validateStudentEditInfo: (req, res, next) => {
        const valid = ajv.validate(STUDENT_EDIT_BODY_SCHEMA, req.body);

        if (!valid) {
            console.log(ajv.errors);
            // TODO: Clean the ajv error
            return res.status(403).send({ error: ajv.errors });
        }

        next();
    }
};

module.exports = studentMw;