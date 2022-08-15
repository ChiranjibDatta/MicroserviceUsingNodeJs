const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios=require('axios');
let Sentiment = require('sentiment');
let sentiment = new Sentiment();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    console.info(req.body)
    const {type,data}=req.body;
    if (type === 'postCreated') {
        var result = sentiment.analyze(data.title);

        const status = result.score<0 ? 0 : 1;

        await axios.post('http://localhost:4005/events', {
            type: 'postModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status:status,
                content: data.title
            }
        });
    }
    if (type === 'commentCreated') {
        var result = sentiment.analyze(data.content);

        const status = result.score<0 ? 0 : 1;

        await axios.post('http://localhost:4005/events', {
            type: 'commentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        });
    }
});

app.listen(4003, () => {
    console.log('Listening on 4003');
});
