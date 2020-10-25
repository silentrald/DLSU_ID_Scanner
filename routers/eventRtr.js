const router    = require('express')();
const api       = require('../api/eventAPI');
const { validateEventIDParams } = require('../middlewares/eventMw');
const mw = {
    ...require('../middlewares/tokenMw'),
    ...require('../middlewares/eventMw'),
};

const {
    ORGANIZER
} = require('../constant').ACCESS;

// GET
router.get('/:eventID',
    mw.verifyToken,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateEventIDParams,
    api.getEvent
);

// GET
/**
 * Gets all events created/assigned to the organizer logged in 
 */
router.get('/all/:userID',
    mw.verifyToken,
    mw.hasAccess([ ORGANIZER ]),
    api.getAllMyEvents
);

// POST
router.post('/create',
    mw.verifyToken,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateEventInfo,
    api.postCreateEvent
);

// PATCH
router.patch('/edit/:eventID',
    mw.verifyToken,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateEventIDParams,
    mw.validateEventInfo,
    mw.isEventOrganizer,
    api.patchEditEvent
);

// DELETE
router.delete('/delete/:eventID',
    mw.verifyToken,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateEventIDParams,
    mw.isEventOrganizer,
    api.deleteEvent
);

module.exports = router;