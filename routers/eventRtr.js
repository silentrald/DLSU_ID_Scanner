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
    // mw.verifyHeaderToken,
    // mw.isEventOrganizer,
    mw.verifyToken,
    mw.hasAccess([ ORGANIZER ]),
    mw.validateEventIDParams,
    api.getEvent
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