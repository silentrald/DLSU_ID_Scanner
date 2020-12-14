const Ajv = require('ajv');
const db = require('../db');
const passwordStrength = require('../modules/passwordStrength');

let ajv = new Ajv({
    allErrors: true,
    coerceTypes: true 
    // jsonPointers: true,
});
require('ajv-keywords')(ajv, ['transform']);

const LOGIN_BODY_SCHEMA = 'a';
const USER_INFO_BODY_SCHEMA = 'b';
const USER_ID_PARAMS_SCHEMA = 'c';
const PASSWORDS_BODY_SCHEMA = 'd';

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
            minLength: 8,
            maxLength: 200, // is this a valid length for a password?
        }
    },
    required: [
        'username',
        'password'
    ]
}, USER_INFO_BODY_SCHEMA);

ajv.addSchema({
    type: 'object',
    properties: {
        userID: {
            type: 'integer',
            minimum: 0,
        }
    },
    required: [ 'userID' ]
}, USER_ID_PARAMS_SCHEMA);

ajv.addSchema({
    type: 'object',
    properties: {
        password: {
            type: 'string',
            minLength: 8,
            maxLength: 200,
        },
        confirmPassword: {
            type: 'string',
            minLength: 8,
            maxLength: 200,
        }
    },
    required: [
        'password',
        'confirmPassword'
    ]
}, PASSWORDS_BODY_SCHEMA);

const userMw = {
    /**
     * Validate if username and password is in
     * a valid format
     */
    validateLogin: (req, res, next) => {
        const valid = ajv.validate(LOGIN_BODY_SCHEMA, req.body);
        console.log(valid);
        if (!valid) {
            console.log(ajv.errorsText());
            return res.status(401).send({ errMsg: 'Auth Failed' });
        }

        next();
    },

    /**
     * Validates user info
     */
    validateUserInfo: async (req, res, next) => {
        const valid = ajv.validate(USER_INFO_BODY_SCHEMA, req.body);

        if (!valid) {
            console.log(ajv.errors);
            return res.status(403).send({ error: ajv.errors });
        }
        
        // validate password strength
        try {
            const strong = await passwordStrength(req.body.password);
            if (!strong) {
                return res.status(403).send({ errMsg: 'Weak Password' });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }

        next();
    },

    /**
     * Validates user id
     */
    validateUserIDParams: (req, res, next) => {
        const valid = ajv.validate(USER_ID_PARAMS_SCHEMA, req.params);

        if (!valid) {
            console.log(ajv.errors);
            return res.status(403).send({ errMsg: 'Invalid user id' });
        }

        next();
    },

    /**
     * Validates passwords
     */
    validatePasswords: (req, res, next) => {
        const valid = ajv.validate(PASSWORDS_BODY_SCHEMA, req.body);

        if (!valid) {
            console.log(ajv.errors);
            //TODO: clean
            return res.status(403).send({ error: ajv.errors });
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(403).send({ errMsg: 'Passwords are not the same' });
        }

        next();
    },

    /**
     * Check whether the user exists in the db
     */
    isExistingUser: async (req, res, next) => {
        const { userID } = req.params;

        try {
            const queryUser = {
                text: `
                    SELECT  *
                    FROM    users
                    WHERE   user_id = $1
                    LIMIT   1;
                `,
                values: [ userID ]
            };
            const { rowCount } = await db.query(queryUser);

            if (rowCount < 1) {
                return res.status(403).send({ errMsg: 'User does not exist' });
            }
            next();
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    },

    /**
     * Validate if the checker account is under the organizer
     */
    isOrganizerAssigned: async (req, res, next) => {
        const { userID } = req.params;

        try {
            const queryCheckerUser = {
                text: `
                    SELECT  *
                    FROM    checker_users
                    WHERE   user_id = $1
                        AND organizer_assigned = $2
                    LIMIT   1;
                `,
                values: [
                    userID,
                    req.user.userID
                ]
            };

            const resultCheckerUser = await db.query(queryCheckerUser);
            if (resultCheckerUser.rowCount < 1) {
                return res.status(403).send({ errMsg: 'Checker is not under you' });
            }

            next();
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    },

    /**
     * Validate the user if fits to the roles offered in list
     */
    checkRoleParams: list => {
        return async (req, res, next) => {
            const { userID } = req.params;

            if (typeof(list) === 'string') {
                list = [ list ];
            }

            const queryUser = {
                text: `
                    SELECT  *
                    FROM    users
                    WHERE   user_id = $1
                    LIMIT   1;
                `,
                values: [ userID ]
            };

            const { rows } = await db.query(queryUser);

            if (!Array.isArray(list)) {
                // FOR DEBUGGING
                console.log('CHECK PARAMS, wrong list params');
                return res.status(500).end();
            }

            if (!req.user || !req.user.access) {
                // FOR DEBUGGING
                console.log('CHECK ROUTE, forgot to add token verification'); 
                return res.status(500).end();
            }

            if (!list.includes(rows[0].access))
                return res.status(403).send({ errMsg: 'User is not a checker' });
            
            next();
        };
    }
};

module.exports = userMw;