const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content, status: 'pending' });

    commentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    });

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log(`Received Event: ${req.body.type}`);

    const { type, data } = req.body;

    switch (type) {
        case 'CommentModerated':
            // we recieve a comment moderated event
            const { postId, id, status, content } = data;
            const comments = commentsByPostId[postId];

            const comment = comments.find(comment => comment.id === id);
            // we update the status of that comment according to the event data
            comment.status = status;
            // we send an event to the event bus that the comment was updated
            await axios.post('http://localhost:4005/events', {
                type: 'CommentUpdated',
                data: {
                    id,
                    postId,
                    status,
                    content
                }
            })
            break;

        default:
            break;
    }

    res.status('ok');
});

app.listen(4001, () => {
    console.log("listening on 4001");
})