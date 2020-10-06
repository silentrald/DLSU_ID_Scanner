const bcrypt    = require('../modules/bcrypt');
const db        = require('../db');
const jwt       = require('../modules/jwt');

const userAPI = {
    // GET

    
    // POST
    postLogin: async (req, res) => {
        let { username, password } = req.body;
        let user;

        try {
            const queryUser = {
                text: `
                    SELECT  *
                    FROM    users
                    WHERE   username = $1
                    LIMIT   1;
                `,
                values: [ username ]
            };
            
            const resultUser = await db.query(queryUser);

            if (resultUser.rowCount < 1) {
                return res.status(401).send({ errMsg: 'Auth Failed' });
            }
                
            user = resultUser.rows[0];
            const userPassword = user.password;
            user.password = undefined;
        
            const result = await bcrypt.compare(password, userPassword);
            if (!result) {
                return res.status(401).send({ errMsg: 'Auth Failed' });
            }

            const token = await jwt.signPromise({
                                    userID: user.user_id,
                                    username: user.username,
                                    access: user.access,
                                }, {
                                    expiresIn: 60 * 60, // 1 hr 
                                });
        
            return res.status(200).send({ 
                token,
                user: {
                    username: user.username,
                    access: user.access,
                },
            });
        } catch (err) {
            console.log(err);
            return res.send(401).send({ errMsg: 'Auth Failed' });
        }
    },

    postVerify: (req, res) => {
        return res.status(200).send(req.user);
    },

    // PATCH
    patchChangePassword: async (req, res) => {
        const { password } = req.body;
        const { userID } = req.params;

        if (parseInt(userID) !== req.user.userID) {
            return res.status(403).send({ errMsg: 'Forbidden' });
        }
        
        try {
            // Password should not be the same with
            // the old password
            const queryUser = {
                text: `
                    SELECT  password
                    FROM    users
                    WHERE   user_id = $1
                    LIMIT   1;
                `,
                values: [ req.user.userID ]
            };

            const resultUser = await db.query(queryUser);
            if (resultUser.rowCount < 1) {
                return res.status(403).send({ errMsg: 'Forbidden' });
            }

            const result = await bcrypt.compare(password, resultUser.rows[0].password);
            if (result) { // same password
                return res.status(403).send({ errMsg: 'Same Password' });
            }

            const hash = await bcrypt.hashSalt(password);

            const queryUpUser = {
                text: `
                    UPDATE  users
                    SET     password = $1
                    WHERE   userID = $2;   
                `,
                values: [ hash, req.user.userID ]
            };

            const { rowCount } = await db.query(queryUpUser);
            if (rowCount < 1) {
                return res.status(403).send({ errMsg: 'Password was not updated' });
            }

            return res.status(200).send({ msg: 'Password changed' });
        } catch (err) {
            console.log(err);

            return res.status(500).end();
        }
    },

    // DELETE
    
};

module.exports = userAPI;