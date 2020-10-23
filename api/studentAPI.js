const db = require('../db');

const studentAPI = {
    // GET
    

    // POST
    postCreateStudent: async (req, res) => {
        const { serialID, studentID, fname, lname } = req.body;

        try {
            // Insert the student info
            const queryInsStudent = {
                text: `
                    INSERT INTO students(serial_id, student_id, fname, lname)
                        VALUES($1, $2, $3, $4);
                `,
                values: [
                    serialID,
                    studentID,
                    fname,
                    lname,
                ]
            };

            await db.query(queryInsStudent);
            return res.status(201).send({ msg: 'Created' });
        } catch (err) {
            console.log(err);
            
            // Might get a duplicate for the serial id
            if (err.code === '23505' && err.constraint === 'students_pkey') {
                return res.status(403).send({ errMsg: 'Student is already in the database' });
            }

            return res.status(500).end({ errMsg: 'Something went wrong!' });
        }
    },

    // PATCH
    patchEditStudent: async (req, res) => {
        const { fname, lname } = req.body;
        const { serialID } = req.params;

        try {
            const queryUpStudent = {
                text: `
                    UPDATE  students
                    SET     fname = $1,
                            lname = $2
                    WHERE   serial_id = $3;
                `,
                values: [
                    fname,
                    lname,
                    serialID
                ]
            };

            const { rowCount } = await db.query(queryUpStudent);
            if (rowCount < 1) {
                return res.status(400).send({ errMsg: 'Student not found' });
            }

            return res.status(200).send({ msg: 'Student info was edited' });
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    },

    // DELETE
    deleteStudent: async (req, res) => {
        const { serialID } = req.params;

        try {
            const queryDelStudent = {
                text: `
                    DELETE FROM students
                    WHERE serial_id = $1;
                `,
                values: [ serialID ]
            };
            const { rowCount } = await db.query(queryDelStudent);

            if (rowCount < 1) { // no student was deleted
                return res.status(400).send({ errMsg: 'Student not found' });
            }

            return res.status(200).send({ msg: 'Student was deleted' });
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    },
};

module.exports = studentAPI;