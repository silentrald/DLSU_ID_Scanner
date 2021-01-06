const router    = require('express')();
const api       = require('../api/assignmentAPI');
const mw = {
    ...require('../middlewares/tokenMw'),
    ...require('../middlewares/assignmentMw'),
    ...require('../middlewares/eventMw'), // isEventOrganizer
    ...require('../middlewares/userMw'),
    ...require('../middlewares/checkerMw'),  // isOrganizerAssigned
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
    mw.isAuth,
    mw.hasAccess([ CHECKER, ORGANIZER ]),
    api.getAllAssignments
);

// GET
/**
 * Get all checkers assigned to logged organizer
 */
router.get('/checker/assigned',
    mw.isAuth,
    mw.hasAccess([ORGANIZER ]),
    api.getAllAssignmentedtoEvent
);

// POST
/**
 * Assigns a checker to an event
 */
router.post('/create/:eventID/:userID',
    mw.isAuth,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateEventAndCheckerID,
    mw.isEventOrganizer,
    mw.isExistingUser,
    mw.checkRoleParams([ CHECKER ]),
    mw.isOrganizerAssigned,
    api.postAssignChecker
);

// DELETE
/**
 * Assigns a checker to an event
 */
router.delete('/delete/:userID/:eventID',
    mw.isAuth,
    mw.hasAccess([ ORGANIZER ]),
    mw.isExistingUser,
    mw.checkRoleParams([ CHECKER ]),
    mw.isOrganizerAssigned,
    mw.isEventOrganizer,
    api.deleteAssignment
);
module.exports = router;