const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
    const event = req.body;

    // posts
    axios.post('http://localhost:4000/events', event);
    // comments
    axios.post('http://localhost:4001/events', event);
    // query service
    axios.post('http://localhost:4002/events', event);

    res.send({ status: 'ok' });
});

app.listen(4005, () => {
    console.log('Listening no 4005');
})