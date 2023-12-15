const { json } = require('body-parser');
const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');

const asyncHandler = require("express-async-handler");
const validateMongoDbId = require('../utils/validateMongodbId');

const {generateRefreshToken} = require("../config/refreshToken");

const jwt = require("jsonwebtoken");
const createUser = asyncHandler(async(req,res) =>{

    const email = req.body.email;

    const findUser=await User.findOne({ email:email});
    

    if(!findUser) {
        // Create a new user

        const newUser=await User.create(req.body);
        res.json(newUser);

    }
    else {
        throw new Error('USe Already Exists');
    }
});

//Login a User
const loginUserCtrl = asyncHandler(async(req,res) => {
    
    const {email,password} = req.body;
   
    // CHECK IF USER EXISTS OR NOT 

    const findUser = await User.findOne({email});

    if(findUser && await findUser.isPasswordMatched(password)){

        const refreshToken=await generateRefreshToken(findUser?.id);
        const updateuser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken:refreshToken,

            },
            {new:true}
        );
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            maxAge: 72 * 24 * 60 * 60 * 1000,
        })
        res.json({
            _id:findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email:User.findUser?.email,
            mobile:findUser?.mobile,
            token:generateToken(findUser?._id),
        });

    } else {
        throw new Error("Invalid Credentials" );
    }
});


// Handle refresh token

const handleRefreshToken = asyncHandler(async(req,res) =>{
    const cookie = req.cookies;
    console.log(cookie);
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({refreshToken});
    if (!user) throw new Error ("No Refresh token present in db or not matched");
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded) => {
        if(err || user.id !== decoded.id){
            throw new Error(" There is something wrong with refresh token ");
        }
        const accessToken =generateRefreshToken(user?._id);
        res.json({accessToken});
    });

});


// get all users 

const getallUser = asyncHandler(async(req,res)=>{
    try{
        
        const getallUsers = await User.find();
        res.json(getallUsers);


    }
    catch(error){
        throw new Error(error)
    }
});

// get a single user

const getUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);

    try{
            const getUser = await User.findById(id);
            res.json({
                getUser,
            });
    }
    catch(error){
        throw new Error(error);
    }

});

/// delete a user


const deleteaUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);


    try{
            const deleteaUser = await User.findByIdAndDelete(id);
            res.json({
                deleteaUser,
            });
    }
    catch(error){
        throw new Error(error);
    }

});

// logout Functionality

const logout = asyncHandler(async(req,res) => {

    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error ("No Refresh Token is Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    
    if(!user){
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true,

        });
        return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate(refreshToken,{
        refreshToken:"",

    });

    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true,
    })
    return res.sendStatus(204);

});

// update a user

// const updatedUser = asyncHandler(async(req,res)=>{
//     const {id} = req.params;
//     try
//     {
//         const updatedUser = await User.findByIdAndUpdate(
//             id,{
//             firstname:req?.body?.firstname,
//             lastname:req?.body?.lastname,
//             email:req?.body?.email,
//             mobile:req?.body?.mobile,
//         },
//         {
//             new:true,
//         })
//     }
// });


const updatedUser = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    validateMongoDbId(_id);

    try{
        const updatedUser = await User.findByIdAndUpdate(_id,{
            firstname:req?.body?.firstname,
            lastname:req?.body?.lastname,
            email:req?.body?.email,
            mobile:req?.body?.mobile,
        },
        {
            new:true
        }
        );
        res.json(updatedUser);
    }catch(error){
        throw new Error(error);
    }

});

const blockUser = asyncHandler(async(req,res)=>{
    const {id } = req.params;
    validateMongoDbId(id);

    try{
        const block = await User.findByIdAndUpdate(id,{
            isBlocked:true
        },
        {
            new:true
        }
        );
        res.json({
            message:"user blocked",
        })

    }catch (error){
        throw new Error(error);
    }

});
const unblockUser = asyncHandler(async(req,res)=>{

    const {id } = req.params;
    validateMongoDbId(id);

    try{
        const unblock = await User.findByIdAndUpdate(id,{
            isBlocked:false
        },
        {
            new:true
        }
        );
        res.json({
            message:"user unBlocked",
        })

    }catch (error){
        throw new Error(error);
    }

});

module.exports = {
    createUser,
    loginUserCtrl,
    getallUser,
    getUser,
    deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
};