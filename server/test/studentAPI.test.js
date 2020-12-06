// const got = require('got');
// const {
//     admin,
//     organizer,
//     checker,
//     eventID,
//     serialID,
//     newSerialID,
// } = require('./testValues');

// const URL = 'http://localhost:5000/api/student';
// const URL_LOGIN = 'http://localhost:5000/api/user/login';

// let adminToken, organizerToken, checkerToken;

// beforeAll(async () => {
//     let p1 = got.post(URL_LOGIN, {
//             json: { ...admin },
//             responseType: 'json',
//             throwHttpErrors: false
//         });

//     let p2 = got.post(URL_LOGIN, {
//             json: { ...organizer },
//             responseType: 'json',
//             throwHttpErrors: false
//         });

//     let p3 = got.post(URL_LOGIN, {
//             json: { ...checker },
//             responseType: 'json',
//             throwHttpErrors: false
//         });

//     let [ r1, r2, r3 ] = await Promise.all([ p1, p2, p3 ]);
//     adminToken = r1.body.token;
//     organizerToken = r2.body.token;
//     checkerToken = r3.body.token;
// });

// describe('/api/student', () => {
//     describe('/api/student/create', () => {
//         test('BODY: valid serialID, fname, lname (Checker Token)', async (done) => {
//             try {
//                 const res = await got.post(URL + '/create', {
//                     json: {
//                         serialID: newSerialID,
//                         fname: 'dummy',
//                         lname: 'dummy',
//                         token: checkerToken,
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(201);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         msg: 'Created'
//                     })
//                 );

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });

//         test('BODY: reinsert prev serialID, fname, lname (Checker Token)', async (done) => {
//             try {
//                 const res = await got.post(URL + '/create', {
//                     json: {
//                         serialID: newSerialID,
//                         fname: 'dummy',
//                         lname: 'dummy',
//                         token: checkerToken
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(403);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         errMsg: 'Student is already in the database'
//                     })
//                 );

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });

//         test('BODY: no token', async (done) => {
//             try {
//                 const res = await got.post(URL + '/create', {
//                     json: {
//                         serialID: newSerialID,
//                         fname: 'dummy',
//                         lname: 'dummy',
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(401);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         errMsg: 'Unauthorized'
//                     })
//                 );

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });

//         test('BODY: missing serialID (Checker Token)', async (done) => {
//             try {
//                 const res = await got.post(URL + '/create', {
//                     json: {
//                         fname: 'dummy',
//                         lname: 'dummy',
//                         token: checkerToken
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(403);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         error: expect.anything()
//                     })
//                 );

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });
    
//         test('BODY: missing fname (Checker Token)', async (done) => {
//             try {
//                 const res = await got.post(URL + '/create', {
//                     json: {
//                         serialID: newSerialID,
//                         lname: 'dummy',
//                         token: checkerToken
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(403);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         error: expect.anything()
//                     })
//                 );

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });

//         test('BODY: missing lname (Checker Token)', async (done) => {
//             try {
//                 const res = await got.post(URL + '/create', {
//                     json: {
//                         serialID: newSerialID,
//                         fname: 'dummy',
//                         token: checkerToken
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(403);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         error: expect.anything()
//                     })
//                 );

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });
    
//         test('BODY: invalid format serialID (Checker Token)', async (done) => {
//             try {
//                 const res = await got.post(URL + '/create', {
//                     json: {
//                         serialID: 'ggfgfgfg',
//                         fname: 'dummy',
//                         lname: 'dummy',
//                         token: checkerToken
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(403);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         error: expect.anything()
//                     })
//                 );

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });
    
//         test('BODY: empty serialID (Checker Token)', async (done) => {
//             try {
//                 const res = await got.post(URL + '/create', {
//                     json: {
//                         serialID: '',
//                         fname: 'dummy',
//                         lname: 'dummy',
//                         token: checkerToken
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(403);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         error: expect.anything()
//                     })
//                 );

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });

//         test('BODY: empty fname (Checker Token)', async (done) => {
//             try {
//                 const res = await got.post(URL + '/create', {
//                     json: {
//                         serialID: newSerialID,
//                         fname: '',
//                         lname: 'dummy',
//                         token: checkerToken
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(403);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         error: expect.anything()
//                     })
//                 );

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });

//         test('BODY: empty lname serialID (Checker Token)', async (done) => {
//             try {
//                 const res = await got.post(URL + '/create', {
//                     json: {
//                         serialID: 'ggfgfgfg',
//                         fname: 'dummy',
//                         lname: '',
//                         token: checkerToken
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(403);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         error: expect.anything()
//                     })
//                 );

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });

//     });

//     describe('/api/student/edit/:serialID', () => {
//         test('Edit fname (Checker Token)', async (done) => {
//             try {
//                 const res = await got.patch(`${URL}/edit/${newSerialID}`, {
//                     json: {
//                         fname: 'editted',
//                         lname: 'dummy',
//                         token: checkerToken
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(200);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         msg: 'Student info was edited'
//                     })
//                 );

//                 // TODO: Check value in the db

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });

//         test('Edit lname (Checker Token)', async (done) => {
//             try {
//                 const res = await got.patch(`${URL}/edit/${newSerialID}`, {
//                     json: {
//                         fname: 'editted',
//                         lname: 'editted',
//                         token: checkerToken
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(200);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         msg: 'Student info was edited'
//                     })
//                 );

//                 // TODO: Check value in the db

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });
    
//         test('Edit without fname (Checker Token)', async (done) => {
//             try {
//                 const res = await got.patch(`${URL}/edit/${newSerialID}`, {
//                     json: {
//                         lname: 'editted',
//                         token: checkerToken
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(403);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         error: expect.anything()
//                     })
//                 );

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });

//         test('Edit without lname (Checker Token)', async (done) => {
//             try {
//                 const res = await got.patch(`${URL}/edit/${newSerialID}`, {
//                     json: {
//                         fname: 'editted',
//                         token: checkerToken
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(403);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         error: expect.anything()
//                     })
//                 );

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });

//     });

//     describe('/api/student/delete', () => {
//         test('BODY: delete the new added student', async (done) => {
//             try {
//                 const res = await got.delete(`${URL}/delete/${newSerialID}`, {
//                     json: {
//                         token: checkerToken,
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(200);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         msg: 'Student was deleted'
//                     })
//                 );

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });

//         test('BODY: delete again', async (done) => {
//             try {
//                 const res = await got.delete(`${URL}/delete/${newSerialID}`, {
//                     json: {
//                         token: checkerToken,
//                     },
//                     responseType: 'json',
//                     throwHttpErrors: false,
//                 });

//                 const { body, statusCode } = res;

//                 expect(statusCode).toEqual(400);

//                 expect(body).toEqual(
//                     expect.objectContaining({
//                         errMsg: 'Student not found'
//                     })
//                 );

//                 done();
//             } catch (err) {
//                 done(err);
//             }
//         });

//     });

// });