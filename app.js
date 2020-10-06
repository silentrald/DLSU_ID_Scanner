// MODULES
const express       = require('express');

const bodyParser    = require('body-parser');
const morgan        = require('morgan');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT | 5000;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API ROUTERS
const userRtr           = require('./routers/userRtr');
const checkerRtr        = require('./routers/checkerRtr');
const studentRtr        = require('./routers/studentRtr');
const eventRtr          = require('./routers/eventRtr');
const attendanceRtr     = require('./routers/attendanceRtr');
const assignmentRtr     = require('./routers/assignmentRtr');

app.use('/api/user', userRtr);
app.use('/api/checker', userRtr);
app.use('/api/student', studentRtr);
app.use('/api/event', eventRtr);
app.use('/api/attendance', attendanceRtr);
app.use('/api/assignment', assignmentRtr);

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});