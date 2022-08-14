const express=require('express');
const bodyParser=require('body-parser');
const axios=require('axios');
const cors=require('cors');

const app=express();
app.use(cors());
app.use(bodyParser.json());

const posts={};

/**
    <PRE>
    post===

    {
        'postId1':{
            id:'postId1',
            title:'Post title',
            comments:[
                {
                    'id':'commentId1ofPostId1',
                    content:'Hello First Comment'
                }
            ]
        }, 'postId2':{
            id:'postId2',
            title:'Post title',
            comments:[
                {
                    'id':'commentId1ofPostId2',
                    content:'Hello First Comment'
                }
            ]
        }

    }
    </PRE>
*/

app.get('/posts',(req,res)=>{
    res.status(200).send(posts);
})

app.post('/events',(req,res)=>{
    const {type,data}=req.body;
    console.info(`${type} : ${JSON.stringify(data)}`)
    if(type==='postCreated'){
        const {id,title,status}=data;
        posts[id]={id,title,status,comments:[]}
    }

    if(type==='postUpdated'){
        const {id,title,status}=data;
        for(let i in posts){
            if(posts[i].id==id){
                posts[i].status=status
            }
        }
    }
    if(type=='commentCreated'){
        const {id,content,postId,status}=data;
        const post=posts[postId];
        post.comments.push({id,content,status});
    }
    if(type=='commentUpdated'){
        const {id,postId,status}=data;
        console.log("I am here: "+status)
        const comments = posts[postId].comments;
        for(let i=0;i<comments.length;i++){
            if(comments[i].id === id){
                comments[i].status=status
            }
        }
        posts[postId].comments=comments;
        console.log(JSON.stringify(posts));
    }
    res.send({})
})

app.listen(4002,()=>{
    console.info('Listening to 4002');
});