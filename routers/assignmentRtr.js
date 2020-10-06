const router    = require('express')();
const api       = require('../api/assignmentAPI');
const mw = {
    ...require('../middlewares/tokenMw'),
    ...require('../middlewares/assignmentMw'),
    ...require('../middlewares/eventMw'), // isEventOrganizer
    ...require('../middlewares/userMw'), // isOrganizerAssigned
};

const {
    ORGANIZER
} = require('../constant').ACCESS;

// GET
/**
 * Get all assignment event from the checker/organizer id
 */
router.get('/all/:userID', 
    mw.verifyHeaderToken,
    api.getAllAssignments);

// POST
router.post('/create/:eventID/:userID',
    mw.verifyToken,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateEventAndCheckerID,
    mw.isEventOrganizer,
    mw.isExistingUser,
    mw.isOrganizerAssigned,
    api.postAssignChecker);

module.exports = router;