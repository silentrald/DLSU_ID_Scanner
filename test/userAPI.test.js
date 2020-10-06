const got = require('got');
const { admin, organizer, checker } = require('./testValues');

const URL = 'http://localhost:5000/api/user';

describe('/api/user', () => {
    let adminToken, checkerToken, organizerToken;

    describe('/api/user/token', () => {
        test('LOGIN: admin', async (done) => {
            try {
                const res = await got.post(URL + '/login', {
                    json: { ...admin },
                    responseType: 'json',
                    throwHttpErrors: false
                });
                
                const { body } = res;
                
                expect(res.statusCode).toEqual(200);

                expect(body).toEqual(
                    expect.objectContaining({
                        token:  expect.any(String),
                        user:   expect.objectContaining({
                            username: 'admin',
                            access: 'a'
                        })
                    })
                );
                
                expect(body.password).toEqual(undefined);
                adminToken = body.token;
                done();
            } catch (err) {
                done(err);
            }
        });

        test('LOGIN: organizer', async (done) => {
            try {
                const res = await got.post(URL + '/login', {
                    json: { ...organizer },
                    responseType: 'json',
                    throwHttpErrors: false
                });

                const { body } = res;

                expect(res.statusCode).toEqual(200);

                expect(body).toEqual(
                    expect.objectContaining({
                        token:  expect.any(String),
                        user:   expect.objectContaining({
                            username: 'organizer',
                            access: 'o'
                        })
                    })
                );
                
                expect(body.password).toEqual(undefined);
                organizerToken = body.token;
                done();
            } catch (err) {
                done(err);
            }
        });

        test('LOGIN: checker', async (done) => {
            try {
                const res = await got.post(URL + '/login', {
                    json: { ...checker },
                    responseType: 'json',
                    throwHttpErrors: false
                });

                const { body } = res;
                
                expect(res.statusCode).toEqual(200);

                expect(body).toEqual(
                    expect.objectContaining({
                        token:  expect.any(String),
                        user:   expect.objectContaining({
                            username: 'checker',
                            access: 'c'
                        })
                    })
                );
                
                expect(body.password).toEqual(undefined);
                checkerToken = body.token;
                done();
            } catch (err) {
                done(err);
            }
        });

        test('LOGIN: user does not exist', async (done) => {
            try {
                const res = await got.post(URL + '/login', {
                    json: {
                        username: 'wrong',
                        password: 'hellomypassword',
                    },
                    responseType: 'json',
                    throwHttpErrors: false
                });

                const { body } = res;
                
                expect(res.statusCode).toEqual(401);

                expect(body).toEqual(
                    expect.objectContaining({
                        errMsg: 'Auth Failed'
                    })
                );

                done();
            } catch (err) {
                done(err);
            }
        });

        test('LOGIN: empty user', async (done) => {
            try {
                const res = await got.post(URL + '/login', {
                    json: {
                        username: '',
                        password: 'password',
                    },
                    responseType: 'json',
                    throwHttpErrors: false
                });

                const { body } = res;
                
                expect(res.statusCode).toEqual(401);

                expect(body).toEqual(
                    expect.objectContaining({
                        errMsg: 'Auth Failed'
                    })
                );

                done();
            } catch (err) {
                done(err);
            }
        });

        test('LOGIN: empty password', async (done) => {
            try {
                const res = await got.post(URL + '/login', {
                    json: {
                        username: 'user',
                        password: '',
                    },
                    responseType: 'json',
                    throwHttpErrors: false
                });

                const { body } = res;
                
                expect(res.statusCode).toEqual(401);

                expect(body).toEqual(
                    expect.objectContaining({
                        errMsg: 'Auth Failed'
                    })
                );

                done();
            } catch (err) {
                done(err);
            }
        });

        test('LOGIN: username too long', async (done) => {
            try {
                const res = await got.post(URL + '/login', {
                    json: {
                        username: 'vyeVwPzXjExCYHSvzSRYCc9983nqUD6NU9PpXHLUXN9ViKTVMT483f69VWexcVBgi2z8RvLy7y8PeEwLjPg6hEzMLkbML49Y8VSV',
                        password: '8characters',
                    },
                    responseType: 'json',
                    throwHttpErrors: false
                });

                const { body } = res;
                
                expect(res.statusCode).toEqual(401);

                expect(body).toEqual(
                    expect.objectContaining({
                        errMsg: 'Auth Failed'
                    })
                );

                done();
            } catch (err) {
                done(err);
            }
        });

        test('LOGIN: password too long', async (done) => {
            try {
                const res = await got.post(URL + '/login', {
                    json: {
                        username: 'password',
                        password: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                    },
                    responseType: 'json',
                    throwHttpErrors: false
                });

                const { body } = res;
                
                expect(res.statusCode).toEqual(401);

                expect(body).toEqual(
                    expect.objectContaining({
                        errMsg: 'Auth Failed'
                    })
                );

                done();
            } catch (err) {
                done(err);
            }
        });

        test('LOGIN: wrong password', async (done) => {
        try {
            const res = await got.post(URL + '/login', {
                json: {
                    username: admin.username,
                    password: 'wrong_password',
                },
                responseType: 'json',
                throwHttpErrors: false
            });

            const { body } = res;
            
            expect(res.statusCode).toEqual(401);

            expect(body).toEqual(
                expect.objectContaining({
                    errMsg: 'Auth Failed'
                })
            );
            
            done();
        } catch (err) {
            done(err);
        }
    });
    });

    describe('/api/user/verify', () => {
        test('VERIFY: admin', async (done) => {
            try {
                const res = await got.post(URL + '/verify', {
                    json: {
                        token: adminToken
                    },
                    responseType: 'json',
                    throwHttpErrors: false
                });

                const { body } = res;

                expect(res.statusCode).toEqual(200);

                expect(body).toEqual(
                    expect.objectContaining({
                        username: 'admin',
                        access: 'a'
                    })
                );

                expect(body.password).toEqual(undefined);
                done();
            } catch (err) {
                done(err);
            }
        });

        test('VERIFY: organizer', async (done) => {
            try {
                const res = await got.post(URL + '/verify', {
                    json: {
                        token: organizerToken
                    },
                    responseType: 'json',
                    throwHttpErrors: false
                });

                const { body } = res;

                expect(res.statusCode).toEqual(200);

                expect(body).toEqual(
                    expect.objectContaining({
                        username: 'organizer',
                        access: 'o'
                    })
                );

                expect(body.password).toEqual(undefined);
                done();
            } catch (err) {
                done(err);
            }
        });

        test('VERIFY: checker', async (done) => {
        try {
            const res = await got.post(URL + '/verify', {
                json: {
                    token: checkerToken
                },
                responseType: 'json',
                throwHttpErrors: false
            });

            const { body } = res;

            expect(res.statusCode).toEqual(200);

            expect(body).toEqual(
                expect.objectContaining({
                    username: 'checker',
                    access: 'c'
                })
            );

            expect(body.password).toEqual(undefined);
            done();
        } catch (err) {
            done(err);
        }
    });
    });

});