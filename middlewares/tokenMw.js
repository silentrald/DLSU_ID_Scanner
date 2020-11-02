const jwt = require('../modules/jwt');

const tokenMw = {
    /**
     * Verifies the token it the request body
     */
    verifyToken: async (req, res, next) => {
        const { token } = req.body;

        try {
            const userData = await jwt.verifyPromise(token);
            req.user = userData;
            next();
        } catch (err) {
            console.log(err);

            // if (err.name === 'TokenExpiredError') // JWT Expired
            // if (err.name === 'JsonWebTokenError')
            // if (err.name === 'NotBeforeError')

            return res.status(401).send({ errMsg: 'Unauthorized' });
        }
    },

    /**
     * Verifies the token in the request query
     */
    verifyHeaderToken: async (req, res, next) => {
        const { token } = req.headers;

        try {
            const userData = await jwt.verifyPromise(token);
            req.user = userData;
            next();
        } catch (err) {
            console.log(err);

            // if (err.name === 'TokenExpiredError') // JWT Expired
            // if (err.name === 'JsonWebTokenError')
            // if (err.name === 'NotBeforeError')
            
            return res.status(401).send({ errMsg: 'Unauthorized' });
        }
    },

    /**
     * Check if the user has access on the page
     * depending on the list given
     * @param {string|array} list
     */
    hasAccess: list => {
        return (req, res, next) => {
            if (typeof(list) === 'string') {
                list = [ list ];
            }

            if (!Array.isArray(list)) {
                // FOR DEBUGGING
                console.log('CHECK PARAMS, wrong list params');
                return res.status(500).end();
            }

            if (!req.user || !req.user.access) {
                // FOR DEBUGGING
                console.log('CHECK ROUTE, forgot to add token verification'); 
                return res.status(500).end();
            }

            if (!list.includes(req.user.access))
                return res.status(403).send({ errMsg: 'Forbidden' });
            
            next();
        };
    }
};

module.exports = tokenMw;