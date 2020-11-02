const got = require('got');
const {
    admin,
    organizer,
    checker,
    eventID,
    // serialID,
} = require('./testValues');

const URL = 'http://localhost:5000/api/assignment';
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

describe('/api/assignment', () => {
    describe('/api/assignment/all/:userID', () => {
        test('Checker userID', async (done) => {
            try {
                const res = await got.get(`${URL}/all/${checker.userID}`, {
                    headers: {
                        token: checkerToken
                    },
                    responseType: 'json',
                    throwHttpErrors: false,
                });

                const { body, statusCode } = res;

                expect(statusCode).toEqual(200);

                // expect(body).toEqual(
                //     expect.objectContaining({
                //         events: expect.arrayContaining({
                //             // TODO: expect an object with properties of
                //             // event_id: expect.any(String),
                //             // event_name: expect.any(String),
                //             // start_date: expect.any(String),
                //             // end_date: expect.any(String),
                //             // organizer_id: expect.any(Number)
                //         })
                //     })
                // );

                done();
            } catch (err) {
                done(err);
            }
        });
    
        test('Organizer userID', async (done) => {
            try {
                const res = await got.get(`${URL}/all/${organizer.userID}`, {
                    headers: {
                        token: organizerToken
                    },
                    responseType: 'json',
                    throwHttpErrors: false,
                });

                const { body, statusCode } = res;

                expect(statusCode).toEqual(200);

                // expect(body).toEqual(
                //     expect.objectContaining({
                //         events: expect.arrayContaining({
                //             // TODO: expect an object with properties of
                //             // event_id: expect.any(String),
                //             // event_name: expect.any(String),
                //         })
                //     })
                // );

                done();
            } catch (err) {
                done(err);
            }
        });

        test('No token passed', async (done) => {
            try {
                const res = await got.get(`${URL}/all/${organizer.userID}`, {
                    responseType: 'json',
                    throwHttpErrors: false,
                });

                const { body, statusCode } = res;

                expect(statusCode).toEqual(403);

                expect(body).toEqual(
                    expect.objectContaining({
                        errMsg: 'Unauthorized'
                    })
                );

                done();
            } catch (err) {
                done(err);
            }
        });
    
        test('Not the same userID and token userID', async (done) => {
            try {
                const res = await got.get(`${URL}/all/${admin.userID}`, {
                    headers: {
                        token: organizerToken
                    },
                    responseType: 'json',
                    throwHttpErrors: false,
                });

                const { body, statusCode } = res;

                expect(statusCode).toEqual(403);

                expect(body).toEqual(
                    expect.objectContaining({
                        errMsg: 'Forbidden'
                    })
                );

                done();
            } catch (err) {
                done(err);
            }
        });
    });

    describe('/api/assigment/create/:eventID/:userID', () => {
        // ORGANIZER TOKEN
        test('Assign a checker', async (done) => {
            try {
                // TODO: create a temporary checker account

                const res = await got.get(`${URL}/create/${eventID}/${checker.userID}`, {
                    headers: {
                        token: organizerToken
                    },
                    responseType: 'json',
                    throwHttpErrors: false,
                });

                const { body, statusCode } = res;

                expect(statusCode).toEqual(201);

                expect(body).toEqual(
                    expect.objectContaining({
                        msg: 'Checker was assigned to the event'
                    })
                );

                done();
            } catch (err) {
                done(err);
            }
        });

        test('Reassign a checker', async (done) => {
            try {
                const res = await got.get(`${URL}/create/${eventID}/${checker.userID}`, {
                    headers: {
                        token: organizerToken
                    },
                    responseType: 'json',
                    throwHttpErrors: false,
                });

                const { body, statusCode } = res;

                expect(statusCode).toEqual(403);

                expect(body).toEqual(
                    expect.objectContaining({
                        errMsg: 'Checker is already assigned to the event'
                    })
                );

                // TODO: delete the temporary account

                done();
            } catch (err) {
                done(err);
            }
        });
    
        // TODO: more format test
        test('Invalid event format', async (done) => {
            try {
                const res = await got.get(`${URL}/create/000000000000/${checker.userID}`, {
                    headers: {
                        token: organizerToken
                    },
                    responseType: 'json',
                    throwHttpErrors: false,
                });

                const { body, statusCode } = res;

                expect(statusCode).toEqual(403);

                expect(body).toEqual(
                    expect.objectContaining({
                        error: expect.anything()
                    })
                );

                done();
            } catch (err) {
                done(err);
            }
        });

        // TODO: more format test
        test('Invalid userID format', async (done) => {
            try {
                const res = await got.get(`${URL}/create/00000000000/hello`, {
                    headers: {
                        token: organizerToken
                    },
                    responseType: 'json',
                    throwHttpErrors: false,
                });

                const { body, statusCode } = res;

                expect(statusCode).toEqual(403);

                expect(body).toEqual(
                    expect.objectContaining({
                        error: expect.anything()
                    })
                );

                done();
            } catch (err) {
                done(err);
            }
        });

        test('Assign a checker to a non-existent event', async (done) => {
            try {
                const res = await got.get(`${URL}/create/00000000000/${checker.userID}`, {
                    headers: {
                        token: organizerToken
                    },
                    responseType: 'json',
                    throwHttpErrors: false,
                });

                const { body, statusCode } = res;

                expect(statusCode).toEqual(403);

                expect(body).toEqual(
                    expect.objectContaining({
                        errMsg: 'Event does not exist'
                    })
                );

                done();
            } catch (err) {
                done(err);
            }
        });

        test('Assign a non-existent checker to an event', async (done) => {
            try {
                const res = await got.get(`${URL}/create/${eventID}/0`, {
                    headers: {
                        token: organizerToken
                    },
                    responseType: 'json',
                    throwHttpErrors: false,
                });

                const { body, statusCode } = res;

                expect(statusCode).toEqual(403);

                expect(body).toEqual(
                    expect.objectContaining({
                        errMsg: 'User does not exist'
                    })
                );

                done();
            } catch (err) {
                done(err);
            }
        });

        test('Assign a checker that does not belong to the organizer', async (done) => {
            // TODO: create another organizer and checker account
            try {
                done();
            } catch (err) {
                done(err);
            }
        });

        // INVALID TOKENS
        test('Assign with a admin account', async (done) => {
            try {
                const res = await got.get(`${URL}/create/${eventID}/${checker.userID}`, {
                    headers: {
                        token: adminToken
                    },
                    responseType: 'json',
                    throwHttpErrors: false,
                });

                const { body, statusCode } = res;

                expect(statusCode).toEqual(403);

                expect(body).toEqual(
                    expect.objectContaining({
                        errMsg: 'Forbidden'
                    })
                );

                done();
            } catch (err) {
                done(err);
            }
        });

        test('Assign with a checker account', async (done) => {
            try {
                const res = await got.get(`${URL}/create/${eventID}/${checker.userID}`, {
                    headers: {
                        token: checkerToken
                    },
                    responseType: 'json',
                    throwHttpErrors: false,
                });

                const { body, statusCode } = res;

                expect(statusCode).toEqual(403);

                expect(body).toEqual(
                    expect.objectContaining({
                        errMsg: 'Forbidden'
                    })
                );

                done();
            } catch (err) {
                done(err);
            }
        });
    });
});