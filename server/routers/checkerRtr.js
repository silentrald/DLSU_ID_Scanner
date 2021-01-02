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
// router.get('/create', 
//     mw.isAuth,
//     mw.hasAccess([ ORGANIZER ]),
//     api.postCreateChecker
// );

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

// POST
/**
 * Creates a checker account
 */
router.post('/assign/:checkerID/:organizerID', 
    mw.isAuth,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateTransfer,
    api.assignChecker
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