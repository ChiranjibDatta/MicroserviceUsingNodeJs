const express=require('express');
const bodyParser=require('body-parser');
const axios =require('axios');

const app=express();
app.use(bodyParser.json());

app.post('/events',async (req,res)=>{
    const event=req.body;
    //POSTS SERVICE
    try{
        await axios.post('http://localhost:4000/events',event);
    }catch(err){
        console.info(err.message);
    }

    //COMMENTS SERVICE
     try{
        await axios.post('http://localhost:4001/events',event);
    }catch(err){
        console.info(err.message);
    }
    //QUERY SERVICE
    try{
        await axios.post('http://localhost:4002/events',event);
    }catch(err){
        console.info(err.message);
    }
    //MODERATOR SERVICE
    try{
        await axios.post('http://localhost:4003/events',event);
    }catch(err){
        console.info(err.message);
    }

    res.send({status:"ok"})
})

app.listen(4005,()=>{
    console.info('Listening on 4005')
})

