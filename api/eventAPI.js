const db = require('../db');

const eventAPI = {
    // GET
    getEvent: async (req, res) => {
        const { eventID } = req.params;

        try {
            const queryEvent = {
                text: `
                    SELECT  *
                    FROM    events
                    WHERE   event_id = $1
                    LIMIT   1;
                `,
                values: [ eventID ]
            };

            const resultEvent = await db.query(queryEvent);

            if (resultEvent.rowCount < 1) {
                return res.status(400).send({ errMsg: 'No Event Found' });
            }

            return res.status(200).send({ event: resultEvent.rows[0] });
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    },

    // POST
    postCreateEvent: async (req, res) => {
        const {
            eventName,
            startDate,
            endDate,
            eventOrg,
            user
        } = req.body;

        organizerID = user.userID;

        if (organizerID !== req.user.userID) {
            return res.status(403).send({ errMsg: 'Forbidden' });
        }

        //Start transaction
        try {
            const client = await db.connect();

            try {
                client.query('BEGIN');
                //Create the event
                const queryInsEvent = {
                    text: `
                        INSERT INTO events(event_id, event_name, start_date, end_date, event_org, organizer_id)
                            VALUES(event_id(), $1, $2, $3, $4, $5)
                            RETURNING event_id;
                    `,
                    values: [
                        eventName,
                        startDate,
                        endDate,
                        eventOrg,
                        organizerID
                    ]
                }

                const resEvent = await client.query(queryInsEvent);

                //Create assignee
                const queryInsAssign = {
                    text: `
                        INSERT INTO assignments(user_id, event_id)
                            VALUES($1, $2);
                    `,
                    values: [
                        organizerID,
                        resEvent.rows[0].event_id,
                    ]
                }

                await client.query(queryInsAssign);

                await client.query('COMMIT');
            } catch (err) {
                //Rollback incase either query fails
                await client.query('ROLLBACK');
                throw err;
            } finally {
                client.release();
            }

            return res.status(201).send({ msg: 'Event was created' });
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    },
    
    // PATCH
    patchEditEvent: async (req, res) => {
        const { eventID } = req.params;
        const {
            eventName,
            startDate,
            endDate,
            eventOrg,
            organizerID
        } = req.body;

        try {
            const queryUpEvent = {
                text: `
                    UPDATE  events
                    SET     event_name   = $1,
                            start_date   = $2,
                            end_date     = $3,
                            event_org    = $4,
                            organizer_id = $5
                    WHERE   event_id = $6;
                `,
                values: [
                    eventName,
                    startDate,
                    endDate,
                    eventOrg,
                    organizerID,
                    eventID,
                ]
            };

            const { rowCount } = await db.query(queryUpEvent);

            if (rowCount < 1) {
                return res.status(403).send({ errMsg: 'No Event was editted' });
            }

            return res.status(200).send({ msg: 'Event was editted' });
        } catch (err) {
            console.log(err);

            return res.status(500).end();
        }
    },

    // DELETE
    deleteEvent: async (req, res) => {
        const { eventID } = req.body;

        try {
            const queryDelEvent = {
                text: `
                    DELETE FROM events
                    WHERE event_id = $1;
                `,
                values: [ eventID ]
            };

            const { rowCount } = await db.query(queryDelEvent);
            if (rowCount < 1) {
                return res.status(403).send({ errMsg: 'Event was not deleted' });
            }

            return res.status(200).send({ msg: 'Event Deleted' });
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    },

};

module.exports = eventAPI;