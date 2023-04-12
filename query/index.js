const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    if (type == 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    } else if (type == 'CommentCreated') {
        const { id, content, postId, status } = data;
        posts[postId].comments.push({ id, content, status });
    } else if (type == 'CommentUpdated') {
        const { id, postId, status, content } = data;
        const post = posts[postId];
        const comment = post.comments.find(c => c.id == id);

        comment.status = status;
        comment.content = content;
    }
};

app.get('/posts/', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send('ok');
});

app.listen(4002, async () => {
    console.log("listening on 4002");

    const res = await axios.get('http://localhost:4005/events');
    console.log("QUERY got events: ", res.data);
    for (let event of res.data) {
        console.log('processing event: ', event);

        handleEvent(event.type, event.data);
    }
});
