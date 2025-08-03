const express = require('express');
const router = express.Router();
const User = require('../model/user');

// POST route to add a user
router.post('/add', async (req, res) => {
    const { name,email, password } = req.body;

    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error adding user' });
    }
});

//GET Route to get a user
router.get('/get',async(req,res) => {
    try{
        const user = await User.find({});
        res.status(201).json(user); 
    }catch(err){
        res.status(500).json({ error: 'Error adding user' });
    }
})
//GET by the specific ID
router.get('/get/:id',async(req,res)=>{
    try{
        const {id }= req.params;
        const user = await User.findById(id);
        res.status(201).json(user)
    }catch(err){
        res.status(500).json({ error: 'Error adding user' });
    }
})
//UPDATE the value
router.put('/put/:id',async(req,res)=>{
    try{
        const {id }= req.params;
        const user = await User.findByIdAndUpdate(id,req.body);
        if(!user){
            res.status(404).json({user:"not avalable"})
        }
        
        const UpdatedUser = await User.findById(id);
        res.status(201).json(UpdatedUser)
    }catch(err){
        res.status(500).json({ error: 'Error adding user' });
    }
})
//Delete the user from the db
router.delete('/remove/:id',async(req,res)=>{
    try{
        const {id }= req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            res.status(404).json({user:"not avalable"})
        }
        res.status(500).json({message:"user deleated"})
    }catch(err){
        res.status(500).json({ error: 'Error adding user' });
    }
})




module.exports = router;
