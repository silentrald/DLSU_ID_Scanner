const router    = require('express')();
const api       = require('../api/studentAPI');
const mw = {
    ...require('../middlewares/tokenMw'),
    ...require('../middlewares/studentMw'),
};

const {
    ADMIN,
    ORGANIZER,
    CHECKER
} = require('../constant').ACCESS;

// POST
/**
 * Creates a new student in the database
 */
router.post('/create',
    mw.isAuth,
    mw.hasAccess([ ADMIN, ORGANIZER, CHECKER ]),
    mw.validateStudentInfo,
    api.postCreateStudent);

/**
 * Edits a student info in the database
 */
// PATCH
router.patch('/edit/:serialID',
    mw.isAuth,
    mw.hasAccess([ ADMIN, ORGANIZER, CHECKER ]),
    mw.validateParamSerialID,
    mw.validateStudentEditInfo,
    api.patchEditStudent);

/**
 * Deletes a student from the database
 */
// DELETE
router.delete('/delete/:serialID',
    mw.isAuth,
    mw.hasAccess([ ADMIN, ORGANIZER, CHECKER ]),
    mw.validateParamSerialID,
    api.deleteStudent);

module.exports = router;