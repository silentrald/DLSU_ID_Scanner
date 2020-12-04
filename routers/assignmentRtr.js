const router    = require('express')();
const api       = require('../api/assignmentAPI');
const mw = {
    ...require('../middlewares/tokenMw'),
    ...require('../middlewares/assignmentMw'),
    ...require('../middlewares/eventMw'), // isEventOrganizer
    ...require('../middlewares/userMw'), // isOrganizerAssigned
};

const {
    CHECKER,
    ORGANIZER
} = require('../constant').ACCESS;

// GET
/**
 * Get all assignment event from the checker id
 */
router.get('/all/:userID',
    mw.verifyHeaderToken,
    mw.hasAccess([ CHECKER, ORGANIZER ]),
    api.getAllAssignments
);

// POST
/**
 * Assigns a checker to an event
 */
router.post('/create/:eventID/:userID',
    mw.verifyToken,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateEventAndCheckerID,
    mw.isEventOrganizer,
    mw.isExistingUser,
    mw.checkRoleParams([ CHECKER ]),
    mw.isOrganizerAssigned,
    api.postAssignChecker
);

// GET
/**
 * Get all checkers assigned to logged organizer
 */
router.get('/checker/assigned',
    mw.verifyHeaderToken,
    mw.hasAccess([ORGANIZER ]),
    api.getAllAssignmentedtoEvent
);

module.exports = router;