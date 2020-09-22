const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT | 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database

// STUDENT Table
// serial_id = 8 string
// id - 99999999 - max
// fname - string
// lname - string

// EVENT Table
// id
// event name

// TODO: TEMP remove this
let db = [{
    serial_id: 'f6709bcf',
    id: 0
}]

app.get('/api/id/:id', (req, res) => {
    console.log(`ID: ${req.params.id}`);
    // if the id is not in the database 
    return res.send({ id: req.params.id, msg: 'got it!' });
});

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});