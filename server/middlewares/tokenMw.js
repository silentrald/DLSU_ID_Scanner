const jwt = require('../modules/jwt');

const tokenMw = {
    /**
     * Verifies the token in the request query
     */
    smartLogin: async (req, res, next) => {
        const { authorization } = req.headers;
        if (authorization && typeof(authorization) === 'string') {
            try {
                const token = authorization.split(' ')[1];
                const userData = await jwt.verifyPromise(token);
                req.user = userData;
            } catch (err) {
                console.log(err);
            }
        }
        
        // if (err.name === 'TokenExpiredError') // JWT Expired
        // if (err.name === 'JsonWebTokenError')
        // if (err.name === 'NotBeforeError')

        next();
    },

    /**
     * Check if user is logged in to the api
     */
    isAuth: (req, res, next) => {
        if (req.user) {
            next();
        } else {
            return res.status(403).send({ error: 'Auth Failed' });
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