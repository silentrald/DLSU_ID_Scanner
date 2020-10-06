const router    = require('express')();
const api       = require('../api/checkerAPI');
const mw = {
    ...require('../middlewares/tokenMw'),
    ...require('../middlewares/userMw'),
    ...require('../middlewares/checkerMw'),
};

// GET

// POST
/**
 * Creates a checker account
 */
router.post('/create', 
    mw.verifyToken,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateUserInfo,
    api.postCreateChecker
);

// PATCH

// DELETE
router.delete('/delete/:checkerID',
    mw.verifyToken,
    mw.hasAccess([ ORGANIZER ]),
    mw.isOrganizerAssigned,

);

module.exports = router;