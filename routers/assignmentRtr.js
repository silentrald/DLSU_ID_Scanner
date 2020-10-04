const router    = require('express')();
const api       = require('../api/assignmentAPI');
const mw = {
    ...require('../middlewares/tokenMw'),
    ...require('../middlewares/assignmentMw'),
};

const {
    ORGANIZER
} = require('../constant').ACCESS;

// GET
/**
 * Get all assignment event from the checker/organizer id
 */
router.get('/all/:userID', 
    mw.verifyQueryToken,
    api.getAllAssignments);

// POST
router.post('/create/:eventID/:checkerID',
    mw.verifyToken,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateEventAndCheckerID,
    mw.isEventOrganizer,
    api.postAssignChecker);

module.exports = router;