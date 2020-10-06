const got = require('got');
const {
    admin,
    organizer,
    checker,
    eventID,
    serialID,
} = require('./testValues');

const URL = 'http://localhost:5000/api/checker';
const URL_LOGIN = 'http://localhost:5000/api/user/login';

let adminToken, organizerToken, checkerToken;

beforeAll(async () => {
    let p1 = got.post(URL_LOGIN, {
            json: { ...admin },
            responseType: 'json',
            throwHttpErrors: false
        });

    let p2 = got.post(URL_LOGIN, {
            json: { ...organizer },
            responseType: 'json',
            throwHttpErrors: false
        });

    let p3 = got.post(URL_LOGIN, {
            json: { ...checker },
            responseType: 'json',
            throwHttpErrors: false
        });

    let [ r1, r2, r3 ] = await Promise.all([ p1, p2, p3 ]);
    adminToken = r1.body.token;
    organizerToken = r2.body.token;
    checkerToken = r3.body.token;
});