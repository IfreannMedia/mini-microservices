const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;

    events.push(event);
    // posts
    axios.post('http://posts-clusterip-srv:4000/events', event).catch(err => console.log("error bus caught error"));
    // comments
    //axios.post('http://comments-srv:4001/events', event).catch(err => console.log("error bus caught error"));
    // query service
    //axios.post('http://query-srv:4002/events', event).catch(err => console.log("error bus caught error"));
    // moderation
    
    //axios.post('http://moderation-srv:4003/events', event).catch(err => console.log("error bus caught error"));
    console.log("EVENT BUS created event, returning OK, events: ", events);
    res.send({ status: 'ok' });
});

app.get('/events', (req, res)=> {
    console.log("EVENT-BUS sending all events: ", events);
    res.send(events);
});

app.listen(4005, () => {
    console.log('Listening on 4005');
})