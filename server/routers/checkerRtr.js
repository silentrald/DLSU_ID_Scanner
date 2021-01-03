const router    = require('express')();
const api       = require('../api/checkerAPI');
const mw = {
    ...require('../middlewares/tokenMw'),
    ...require('../middlewares/userMw'),
    ...require('../middlewares/checkerMw'),
};

const {
    ORGANIZER,
    CHECKER
} = require('../constant').ACCESS;

// GET
/**
 * Gets a checker account
 */
router.get('/:userID', 
    mw.isAuth,
    mw.hasAccess([ ORGANIZER ]),
    mw.isExistingUser,
    mw.checkRoleParams([ CHECKER ]),
    mw.isOrganizerAssigned,
    api.getChecker
);

// POST
/**
 * Creates a checker account
 */
router.post('/create', 
    mw.isAuth,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateUserInfo,
    api.postCreateChecker
);

// PATCH

// DELETE
/**
 * Deletes a checker account
 */
router.delete('/delete/:userID',
    mw.isAuth,
    mw.hasAccess([ ORGANIZER ]),
    mw.isExistingUser,
    mw.checkRoleParams([ CHECKER ]),
    mw.isOrganizerAssigned,
    api.deleteChecker
);

module.exports = router;