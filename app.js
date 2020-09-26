// MODULES
const express = require('express');

const bcrypt        = require('./modules/bcrypt');
const bodyParser    = require('body-parser');
const jwt           = require('./modules/jwt');

const { Pool }      = require('pg');

const morgan        = require('morgan');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT | 5000;
const pool = new Pool({
    user:       process.env.PG_USER,
    host:       process.env.PG_HOST,
    password:   process.env.PG_PASS,
    port:       process.env.PG_PORT,
    database:   process.env.PG_DB
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
    let { username, password } = req.body;
    let user;

    const queryUser = {
        text: `
            SELECT  *
            FROM    users
            WHERE   username = $1
            LIMIT   1;
        `,
        values: [ username ]
    };

    pool.query(queryUser)
        .then(result => {
            if (result.rowCount === 0) {
                res.status(401).send({ msg: 'Auth Failed' });
                throw undefined;
            }
        
            user = result.rows[0];
            const userPassword = user.password;
            user.password = undefined;

            console.log(user);

            return bcrypt.compare(password, userPassword);
        })
        .then(result => {
            if (!result) {
                res.status(401).send({ msg: 'Auth Failed' });
                throw undefined;
            }

            return jwt.signPromise({
                    username: user.username,
                    access: user.access,
                }, {
                    expiresIn: 60 * 60, // 1 hr 
                });
        })
        .then(token => {
            return res.status(200).send({ token });
        })
        .catch(err => {
            if (!err) return;

            console.log(err);
            res.send(401).send({ msg: 'Auth Failed' });
        });
});

app.post('/api/id/:id', (req, res) => {
    const { token } = req.body;
    jwt.verifyPromise(token)
        .then(_userData => {
            console.log(`ID: ${req.params.id}`);
            
            const queryStudent = {
                text: `
                    SELECT  *
                    FROM    students
                    WHERE   serial_id = $1
                    LIMIT   1;
                `,
                values: [ req.params.id ]
            };
            
            return pool.query(queryStudent);
        })
        .then(result => {
            if (result.rowCount === 0) {
                // make a new entry
                return res.status(200).send({ msg: 'GOTO Create Account' });
            } else {
                return res.status(200).send({ msg: 'GOOD' });
            }
        })
        .catch(err => {
            console.log(err);
            // if (err.name === 'TokenExpiredError') // JWT Expired
            // if (err.name === 'JsonWebTokenError')
            // if (err.name === 'NotBeforeError)
            return res.status(401).send({ msg: 'Unauthorized' });
        });
});

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});