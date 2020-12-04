const router    = require('express')();
const api       = require('../api/checkerAPI');
const mw = {
    ...require('../middlewares/tokenMw'),
    ...require('../middlewares/userMw'),
    ...require('../middlewares/checkerMw'),
};

const {
    ORGANIZER
} = require('../constant').ACCESS;

// GET

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
router.delete('/delete/:checkerID',
    mw.isAuth,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateUserIDParams,
    mw.isOrganizerAssigned,
    api.deleteChecker
);

module.exports = router;