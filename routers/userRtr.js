const router    = require('express')();
const api       = require('../api/userAPI');
const mw = {
    ...require('../middlewares/tokenMw'),
    ...require('../middlewares/userMw'),
};

const {
    ADMIN
    // ORGANIZER,
    // CHECKER
} = require('../constant').ACCESS;

// GET


// POST
/**
 * Login and returns a token to the user.
 * Request body must contain a username and a password
 */
router.post('/login', 
    mw.validateLogin,
    api.postLogin
);

/**
 * Verifies the token passed in the body
 */
router.post('/verify',
    mw.verifyToken,
    api.postVerify
);

/**
 * Creates an organizer user with the admin account
 */
router.post('/organizer/create',
    mw.verifyToken,
    mw.hasAccess([ ADMIN ]),
    mw.validateUserInfo,
    api.postCreateOrganizer
);

// PATCH
/**
 * Change Password
 */
router.patch('/password-change/:userID',
    mw.verifyToken,
    mw.validateUserIDParams,
    mw.validatePasswords,
    api.patchChangePassword
);

// DELETE
router.delete('/organizer/:userID',
    mw.verifyToken,
    mw.hasAccess([ ADMIN ]),
    mw.validateUserIDParams,
    api.deleteOrganizer
);

module.exports = router;