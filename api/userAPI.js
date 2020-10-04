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

            if (resultUser.rowCount === 0) {
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
    }
};

module.exports = userAPI;