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

    postCreateOrganizer: async (req, res) => {
        const {
            username,
            password
        } = req.body;
        
        try {
            const queryInsOrganizer = {
                text: `
                    INSERT INTO users(username, password, access)
                        VALUES($1, $2, $3);
                `,
                values: [
                    username,
                    password,
                    'o'
                ]
            };
            await db.query(queryInsOrganizer);

            return res.status(201).send({ msg: 'Organizer User Created' });
        } catch (err) {
            console.log(err);

            // duplicate username error
            if (err.code === '23505' && err.constraint === 'users_username_key') {
                return res.status(403).send({ errMsg: 'Username is already in use, choose another one' });
            }

            return res.status(500).end();
        }
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
    deleteOrganizer: async (req, res) => {
        const { userID } = req.params;

        try {
            const queryDelUser = {
                text: `
                    DELETE FROM organizers
                    WHERE   user_id = $1
                        AND access = $2;
                `,
                values: [ userID, 'o' ]
            };

            const { rowCount } = await db.query(queryDelUser);
            if (rowCount < 1) {
                return res.render(403).send({ errMsg: 'You cannot delete the user' });
            }

            return res.render(200).send({ msg: 'Organizer User has been deleted' });
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    },
};

module.exports = userAPI;