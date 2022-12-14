const express=require('express');
const bodyParser=require('body-parser');
const {randomBytes}=require('crypto');
const cors=require('cors');
const axios=require('axios');

const app=express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId={};


app.get('/posts/:id/comments',(req,res)=>{
    res.send(commentsByPostId[req.params.id] || []);
})

app.post('/posts/:id/comments',async (req,res)=>{
    const commentId=randomBytes(4).toString('hex');
    const {content}=req.body;
    const comments=commentsByPostId[req.params.id] || [];
    comments.push({id:commentId,content,status:-1});
    commentsByPostId[req.params.id]=comments;
    try{
        await axios.post('http://localhost:4005/events',{
            type:'commentCreated',
            data:{
                id:commentId,content,postId:req.params.id,status:-1
            }
        })
    }catch(err){
        console.info(err.message)
    }
    res.status(201).send(comments);
})

app.post('/events',async(req,res)=>{
    console.info(`Received event ${req.body.type}`);
    const { type, data } = req.body;
    if (type === "commentModerated") {
        const { postId, id, status, content } = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find((comment) => {
          return comment.id === id;
        });
        comment.status = status;
        await axios.post("http://localhost:4005/events", {
          type: "commentUpdated",
          data: {
            id,
            status,
            postId,
            content
          },
        });
    }
    res.send({})
})

app.listen(4001,()=>{
    console.info(`Listening to 4001`);
})
