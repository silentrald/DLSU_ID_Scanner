const router    = require('express')();
const api       = require('../api/userAPI');
const mw = {
    ...require('../middlewares/tokenMw'),
    ...require('../middlewares/userMw'),
};

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

module.exports = router;