const router    = require('express')();
const api       = require('../api/eventAPI');
// const { validateEventIDParams } = require('../middlewares/eventMw');
const mw = {
    ...require('../middlewares/tokenMw'),
    ...require('../middlewares/eventMw'),
};

const {
    ORGANIZER
} = require('../constant').ACCESS;

// GET
router.get('/:eventID',
    mw.isAuth,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateEventIDParams,
    api.getEvent
);

// GET
/**
 * Gets all events created/assigned to the organizer logged in 
 */
router.get('/all/:userID',
    mw.isAuth,
    mw.hasAccess([ ORGANIZER ]),
    api.getAllMyEvents
);

// POST
router.post('/create',
    mw.isAuth,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateEventInfo,
    api.postCreateEvent
);

// PATCH
router.patch('/edit/:eventID',
    mw.isAuth,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateEventIDParams,
    mw.validateEventInfo,
    mw.isEventOrganizer,
    api.patchEditEvent
);

// DELETE
router.delete('/delete/:eventID',
    mw.isAuth,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateEventIDParams,
    mw.isEventOrganizer,
    api.deleteEvent
);

module.exports = router;