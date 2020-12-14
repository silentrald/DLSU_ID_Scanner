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
    mw.isAuth,
    api.postVerify
);

/**
 * Creates an organizer user with the admin account
 */
router.post('/organizer/create',
    mw.isAuth,
    mw.hasAccess([ ADMIN ]),
    mw.validateUserInfo,
    api.postCreateOrganizer
);

/**
 * Gets an organizer user with the admin account
 */
router.get('/organizer/:userID',
    mw.isAuth,
    mw.hasAccess([ ADMIN ]),
    mw.validateUserIDParams,
    api.getOrganizer
);

// PATCH
/**
 * Change Password
 */
router.patch('/password-change/:userID',
    mw.isAuth,
    mw.validateUserIDParams,
    mw.validatePasswords,
    api.patchChangePassword
);

// DELETE
router.delete('/organizer/delete/:userID',
    mw.isAuth,
    mw.hasAccess([ ADMIN ]),
    mw.validateUserIDParams,
    api.deleteOrganizer
);

module.exports = router;