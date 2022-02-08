// BUILD YOUR SERVER HERE
const express = require('express')
const userModel = require('./users/model')
const server = express()

server.use(express.json());

server.get('/api/users', (req, res)=>{
    userModel.find()
    .then(users =>{
        res.json(users)
    })
    .catch(() =>{
        res.status(500).json({message:"could not get users"})
    })
})

server.get('/api/users/:id', (req, res)=>{
    const { id } = req.params
    userModel.findById(id)
    .then(user=>{
        if(user == null){
            res.status(404).json({message:"does not exist"})
        } else {
            res.json(user)
        }
    })
    .catch(()=>{
        res.status(404).json({message:"does not exist"})
    })
})

server.post('/api/users', (req, res)=>{
    const body = req.body;
    if(!body.name || !body.bio){
        res.status(400).json({message:"provide name and bio"})
    } else {
        userModel.insert(body)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(() => {
            res.status(400).json({message:"user could not be added"})
        })
    }
})

server.delete('/api/users/:id', (req, res)=> {
    const { id } = req.params;
    userModel.remove(id)
    .then(user => {
        if (user == null) {
            res.status(404).json({message:"does not exist"})            
        } else {
            res.json(user)
        }
    })
    .catch(() => {
        res.status(404).json({message:"does not exist"})
    })
})

server.put('/api/users/:id', async (req, res)=>{
    const { id } = req.params;
    
    try{
        let body = req.body;
        if(!body.name){
            res.status(400).json({message:"provide name and bio"})
            return;
        } else if (!body.bio){
            res.status(400).json({message:"provide name and bio"})
            return;            
        } else {
            let newUser = await userModel.update(id, body)
            if(newUser == null){
                res.status(404).json({message:"does not exist"})
                return;
            } else {
                res.status(200).json(newUser)
                return;
            }
        }
    }catch(e){
        res.status(404).json({message:"does not exist"})
    }

})

module.exports = server; // EXPORT YOUR SERVER instead of {}
