const bcrypt = require('../modules/bcrypt');
const db = require('../db');

const checkerAPI = {
    // GET

    // POST
    postCreateChecker: async (req, res) => {
        const {
            username,
            password
        } = req.body;

        try {
            const hash = await bcrypt.hashSalt(password);

            const client = await db.connect();

            try {
                await client.query('BEGIN');

                const queryInsUser = {
                    text: `
                        INSERT INTO users(username, password, access)
                            VALUES($1, $2, $3)
                        RETURNING user_id;
                    `,
                    values: [
                        username,
                        hash,
                        'c',
                    ]
                };
                const resultUser = await client.query(queryInsUser);
                
                const queryInsChecker = {
                    text: `
                        INSERT INTO checker_users(user_id, organizer_assigned)
                            VALUES($1, $2);
                    `,
                    values: [
                        resultUser.rows[0].user_id,
                        req.user.userID
                    ]
                };
                await client.query(queryInsChecker);

                await client.query('COMMIT');
            } catch (err) {
                await client.query('ROLLBACK');
                throw err;
            } finally {
                client.release();
            }

            return res.status(201).send({ msg: 'Checker User has been added' });
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

    // DELETE
    deleteChecker: async (req, res) => {
        const { userID } = req.params;

        try {
            const client = await db.connect();
            
            try {
                await client.query('BEGIN');

                const queryDelCheckerUser = {
                    text: `
                        DELETE FROM checker_users
                        WHERE   user_id = $1; 
                    `,
                    values: [ userID ]
                };
                await client.query(queryDelCheckerUser);

                const queryDelUser = {
                    text: `
                        DELETE FROM users
                        WHERE user_id = $1;
                    `,
                    values: [ userID ]
                };
                await client.query(queryDelUser);
                await client.query('COMMIT');
            } catch (err) {
                await client.query('ROLLBACK');
                throw err;
            } finally {
                client.release();
            }

            return res.status(200).send({ msg: 'Checker Account Deleted' });
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    },
};

module.exports = checkerAPI;