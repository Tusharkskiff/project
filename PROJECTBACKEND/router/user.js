const express = require('express');
const router=express.Router();
const User=require('../models/User');
const bycrpt=require('bcrytjs');
const jwt=require('jsonwebtoken');
const crypto =require('crypto');
const multer=require('multer');
const path=require('path');

//multer
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },
    filename:function(req,file,cb){
        const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1E9);
        cb(null,file,fieldname+'-'+uniqueSuffix+path.extname(file.originalname));
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype==='inage/jpeg' ||
    file.mimetype==='image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
};

const upload=multer({storage:storage,fileFilter:fileFilter});

router.get('/users',async(req,res)=>{
    const page=parseInt(req.query.page) ||1;
    const pageSize=parseInt(req.query.pageSize)||100;
    const search = req.query.search ||'';
    const selectedCompanies =req.query.companies ||[];

    try{
        let query = {
            $or:[
                {firstName: {$regex: search, $options:'i'}},
                {lastName: {$regex: search, $options:'i'}},

                {email: {$regex:search,$options:'i'}},
                {foodDetails:{$regex:search,$options:'i'}},
            ]
        };

        if(selectedCompanies.length>0){
            query.foodDetails={$in:selectedCustomers};
        }

        const users = await User.find(query)
        .skip((page-1)*pageSize)
        .limit(pageSize);

        console.log('fetched Users: ',users);

        res.json(users);
        
    }catch(error){
        res.status(500).json({error:error.message});
        
    }
});

router.get('/customers',async(req ,res)=>{
    try{
        const companies=await Userdistinct("foodDetails");
        res.json(customers);
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

router.post('/user'
    upload.single('profileImage'),async(req,res)=>{
        try{
            const {email,password}=req.body;
            const existingUser=awai User.findOne({
                email: req.body.email,
            });
            
            if(existingUser){
                return res.status(409).json({message:'User already exists.'});
        }
        const saltRounds=10;
        const hashedPassword=bcrypt.hashSync(password,saltRounds);
        console.log('Hashed Password duirng registration:',hashedPassword);

        const newUser=new User({
            email:email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            foodDetails: req.body.foodDetails,
            profileImage: '/uploads/' + req.file.filename,

        });

        await newUser.save();
        res.json({message: 'User created successfully!😊'});

    }catch (error){
        res.status(500).json({error: error.message});
    }
});

router.put('/users/:id', async(req,res)=>{
    try{
        const{_id,...userData}=req.body;
        const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!user){
            return res.status(404).json({message:'User not found.'});
        }
        res.send(user);
    }catch (error){
        res.status(500).json({error: error.message});
    }
});

// router.put('/users/:id',async(req,res)=>){
//     const userId = req.params.id;
//     const updateUserData = req.body;

//     try{
//         const updatedUser = await User.findByIdAndUpdate(userId,updateUserData,{new:true});

//         if(!updatedUser){
//             return res.status(404).json({message:'User not found'});
//     }

//     return res.json(updatedUser);
// }catch(error){
//     console.error('Error updating user : ',error);
//     return res.status(500).json({error: 'Failed to update user'});
// }
// });