const router    = require('express')();
const api       = require('../api/attendanceAPI');
const mw = {
    ...require('../middlewares/tokenMw'),
    ...require('../middlewares/attendanceMw'),
};

const {
    ORGANIZER,
    CHECKER
} = require('../constant').ACCESS;

// GET

// POST
/**
 * Marks a student's entrance to an event
 */
router.post('/enter/:eventID/:serialID',
    mw.verifyToken,
    mw.hasAccess([ ORGANIZER, CHECKER ]),
    mw.validateParamEventAndStudentID,
    api.postMarkEntranceAttendance
);

/**
 * Marks a student's exit to an event
 */
router.post('/exit/:eventID/:serialID',
    mw.verifyToken,
    mw.hasAccess([ ORGANIZER, CHECKER ]),
    mw.validateParamEventAndStudentID,
    api.postMarkExitAttendance
);

module.exports = router;