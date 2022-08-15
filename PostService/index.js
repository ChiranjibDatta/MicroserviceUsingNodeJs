const express=require('express');
const bodyParser=require('body-parser');
const {randomBytes}=require('crypto');
const cors=require('cors');
const axios=require('axios');

const app=express();
app.use(bodyParser.json());
app.use(cors());

const posts={};

app.get('/posts',(req,res)=>{
    res.send(posts);
})

app.post('/posts',async (req,res)=>{
    const id=randomBytes(4).toString('hex');
    const {title}=req.body;
    posts[id]={id,title,status:-1};
    try{
        await axios.post('http://localhost:4005/events',{
            type:'postCreated',
            data:{
                id,title,status:-1
            }
        })
    }catch(err){
        console.info(err.message)
    }
    res.status(201).send(posts[id]);
})

app.post('/events',async(req,res)=>{
    console.info(`Received event ${req.body.type} Status is ${req.body.data.status} `);
    const { type, data } = req.body;
    if (type === "postModerated") {
        const { id, title,status } = data;
        posts[id]={id,title,status};
        await axios.post("http://localhost:4005/events", {
          type: "postUpdated",
          data: {
            id,
            title,
            status:status
          },
        });
    }
    res.send({})
})

app.listen(4000,()=>{
    console.info(`Listening to 4000`);
})
