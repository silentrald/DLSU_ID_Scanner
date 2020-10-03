const Ajv = require('ajv');
let ajv = new Ajv({
    allErrors: true,
    // jsonPointers: true,
});
require('ajv-keywords')(ajv, ['transform']);

const LOGIN_BODY_SCHEMA = 'a';

ajv.addSchema({
    type: 'object',
    properties: {
        username: {
            type: 'string',
            transform: [ 'trim' ],
            minLength: 1,
            maxLength: 30,
        },
        password: {
            type: 'string',
            // minLength: 8,
            maxLength: 200, // is this a valid length for a password?
        }
    },
    required: [ 'username', 'password' ]
}, LOGIN_BODY_SCHEMA);

const userMw = {
    validateLogin: (req, res, next) => {
        const valid = ajv.validate(LOGIN_BODY_SCHEMA, req.body);

        if (!valid) {
            console.log(ajv.errorsText());
            return res.status(401).send({ errMsg: 'Auth Failed' });
        }

        next();
    },
};

module.exports = userMw;