const router    = require('express')();
const api       = require('../api/attendanceAPI');
const mw = {
    ...require('../middlewares/tokenMw'),
    ...require('../middlewares/attendanceMw'),
    ...require('../middlewares/eventMw'),
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
    mw.isAuth,
    mw.hasAccess([ ORGANIZER, CHECKER ]),
    mw.validateParamEventAndStudentID,
    mw.checkAssignments,
    api.postMarkEntranceAttendance
);

// PATCH
/**
 * Marks a student's exit to an event
 */
router.patch('/exit/:eventID/:serialID',
    mw.isAuth,
    mw.hasAccess([ ORGANIZER, CHECKER ]),
    mw.validateParamEventAndStudentID,
    mw.checkAssignments,
    api.patchMarkExitAttendance
);

// DELETE
router.delete('/delete/:eventID/:serialID',
    mw.isAuth,
    mw.hasAccess([ ORGANIZER, CHECKER ]),
    mw.validateParamEventAndStudentID,
    mw.checkAssignments,
    api.deleteAttendance
);

module.exports = router;