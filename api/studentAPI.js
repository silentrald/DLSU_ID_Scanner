const db = require('../db');

const studentAPI = {
    // POST
    /**
     * Creates a new student in the database
     */
    postCreateStudent: async (req, res) => {
        const { serialID, fname, lname } = req.body;

        try {
            // Insert the student info
            const queryInsStudent = {
                text: `
                    INSERT INTO students(serial_id, fname, lname)
                        VALUES($1, $2, $3);
                `,
                values: [
                    serialID,
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

    },

    // DELETE
    deleteStudent: async (req, res) => {
        
    },
};

module.exports = studentAPI;