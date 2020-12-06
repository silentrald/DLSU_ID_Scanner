const db = require('../db');
// const jwt = require('../modules/jwt');

const attendanceAPI = {
    // GET
    // getAttendance: async (req, res) => {

    // },

    // POST
    postMarkEntranceAttendance: async (req, res) => {
        const { eventID, serialID } = req.params;
        let student;

        console.log(`Enter ID: ${serialID}`);

        try {
            // Check if the ID is in the database
            const queryStudent = {
                text: `
                    SELECT  *
                    FROM    students
                    WHERE   serial_id = $1
                    LIMIT   1;
                `,
                values: [ serialID ]
            };

            const resultStudent = await db.query(queryStudent);
            if (resultStudent.rowCount < 1) {
                // The ID is not in the database so the user must create an account
                // before getting marked in the event
                return res.status(200).send({ msg: 'ID has not been registered', create: true });
            }
            student = resultStudent.rows[0];
            
            //Check if event exists
            //Gets the event 
            const queryGetEvent = {
                text: `
                    SELECT  *
                    FROM    events
                    WHERE   event_id = $1
                    LIMIT   1;
                `,
                values: [ eventID ]
            };
     
            const resultEvent = await db.query(queryGetEvent);

            if (resultEvent.rowCount < 1) {
                // The eventID does not exist in the DB
                return res.status(200).send({ msg: 'eventID does not exist in database'});
            }

            const event = resultEvent.rows[0];
            const eventDateStart = event.start_date.valueOf();
            const eventDateEnd = event.end_date.valueOf();
            //TODO Compare the dates
            const dateNow = new Date().valueOf();
            console.log(dateNow);
            console.log(eventDateStart);
            console.log(eventDateEnd);
            console.log(dateNow >= eventDateStart && dateNow <= eventDateEnd);

            const queryInsAttendance = {
                text: `
                    INSERT INTO attendances(student_id, event_id)
                        VALUES($1, $2);
                `,
                values: [ serialID, eventID ]
            };
     
            await db.query(queryInsAttendance);
            return res.status(201).send({
                msg: `Enter Attendance marked for ${student.fname} ${student.lname}`,
                create: false
            });
        } catch (err) {
            console.log(err);
    
            if (err.name === 'error' && err.code === '23505' && err.constraint === 'attendances_student_id_event_id_key') {
                return res.status(200).send({ msg: 'Enter Attendance already marked', create: false });
            }

            return res.status(500).end();
        }
    },

    // PATCH
    patchMarkExitAttendance: async (req, res) => {
        const { eventID, serialID } = req.params;
        let student;

        console.log(`Exit ID: ${serialID}`);

        try {
            // Check if the ID is in the database
            const queryStudent = {
                text: `
                    SELECT  *
                    FROM    students
                    WHERE   serial_id = $1
                    LIMIT   1;
                `,
                values: [ serialID ]
            };

            const resultStudent = await db.query(queryStudent);
            if (resultStudent.rowCount < 1) {
                return res.status(200).send({ msg: 'ID has not been registered' });
            }
            student = resultStudent.rows[0];

            // Check if the student was already marked entry in this event
            const queryAttendance = {
                text: `
                    SELECT  exit_timestamp
                    FROM    attendances
                    WHERE   event_id = $1
                        AND student_id = $2
                    LIMIT   1;
                `,
                values: [ eventID, serialID ]
            };

            const resultAttendance = await db.query(queryAttendance);
            if (resultAttendance.rowCount < 1) {
                return res.status(200).send({ msg: 'ID has not entered the event' });
            }

            // If the exit_timestamp has a value then student is already marked
            if (resultAttendance.rows[0].exit_timestamp) {
                return res.status(200).send({ msg: 'Exit Attendance already marked' });
            }

            // Update the attendance by updating the exit timestamp
            const queryUpAttendance = {
                text: `
                    UPDATE  attendances
                    SET     exit_timestamp = now()
                    WHERE   event_id = $1
                        AND student_id = $2;
                `,
                values: [ eventID, serialID ]
            };
            await db.query(queryUpAttendance);
            return res.status(200).send({ msg: `Exit Attendance marked for ${student.fname} ${student.lname}` });
        } catch (err) {
            console.log(err);
            
            return res.status(500).end();
        }
    },

    // DELETE
    deleteAttendance: async (req, res) => {
        const { eventID, serialID } = req.params;

        try {
            const queryDelAttendance = {
                text: `
                    DELETE FROM attendances
                    WHERE   event_id = $1
                        AND serial_id = $2;
                `,
                values: [ eventID, serialID ]
            };

            const { rowCount } = await db.query(queryDelAttendance);
            if (rowCount < 1) {
                return res.status(400).send({ errMsg: 'Attendance was not found' });
            }

            return res.status(200).send({ msg: 'Attendance was deleted' });
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    },

};

module.exports = attendanceAPI;