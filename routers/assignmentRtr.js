const router    = require('express')();
const api       = require('../api/assignmentAPI');
const mw = {
    ...require('../middlewares/tokenMw'),
    // ...require('../middlewares/assignmentMw'),
};

/**
 * Get all assignment event from the checker id
 */
router.post('/user', api.postAllAssignments);

module.exports = router;