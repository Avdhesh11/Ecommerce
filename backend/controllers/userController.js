import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'


//@desc  - auth user and get token
//@route  - POST api/user/login
//@access  - public
const authUser = asyncHandler(async(req,res) => {
    const {email,password} = req.body    //by help of body parser
    const user = await User.findOne({email})

    if(user && (await user.matchPassword(password))){
        res.json({
            _id:user.id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user.id)
        })
    }
    else{
        res.status(401)
        throw new Error('Invalid email or password!!')
    }
})

//@desc  - Register new user
//@route  - POST api/users
//@access  - public
const registerUser = asyncHandler(async(req,res) => {
    const {name,email,password} = req.body    //by help of body parser
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({
        name,
        email,
        password
    })
    if(user){
        res.json({
            _id:user.id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user.id)
        })
    }
    else{
        res.status(400)
        throw new Error('Invalid user data')

    }
})


//@desc  - get User Profile
//@route  - GET api/users/profile
//@access  - private
const getUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id)
    if(user){
        res.json({
            _id:user.id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
        })
    }
    else{
        res.status(404)
        throw new Error('User Not Found')
    }
})

//@desc  - Update User Profile
//@route  - PUT api/users/profile
//@access  - private
const updateUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id)
    if(user){

        user.name =  req.body.name || user.name
        user.email =  req.body.email || user.email
        if(req.body.password){
            user.password = req.body.password
        }

        const updatedUser = await user.save()
        res.json({
            _id:updatedUser.id,
            name:updatedUser.name,
            email:updatedUser.email,
            isAdmin:updatedUser.isAdmin,
            token:generateToken(updatedUser.id)
        })
    }
    else{
        res.status(404)
        throw new Error('User Not Found')
    }
})

//@desc  - get all Users
//@route  - GET api/users
//@access  - private/Admin
const getUsers = asyncHandler(async(req,res) => {
    const users = await User.find({})
    res.json(users)
})

//@desc  - DELETE user 
//@route  - DELETE api/users/:id
//@access  - private/Admin
const deleteUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id)
    if(user){
        await user.remove()
        res.json({message:'User removed'})
    }
    else{
        res.status(404)
        throw new Error('User not Found')
    }
    
})

//@desc  -   Get user by id
//@route  - Get api/users/:id
//@access  - private/Admin
const getUserById = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id).select('-password')
    if(user){
        res.json(user)
    }
    else{
        res.status(404)
        throw new Error('User not Found')
    }
    
})

//@desc  - Update User Profile by admin
//@route  - PUT api/users/:id
//@access  - private/Admin
const updateUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id)
    if(user){
        user.name =  req.body.name || user.name
        user.email =  req.body.email || user.email
        user.isAdmin = req.body.isAdmin

        const updatedUser = await user.save()
        res.json({
            _id:updatedUser.id,
            name:updatedUser.name,
            email:updatedUser.email,
            isAdmin:updatedUser.isAdmin
        })
    }
    else{
        res.status(404)
        throw new Error('User Not Found')
    }
})


export {authUser, registerUser,getUserProfile,updateUserProfile,getUsers,deleteUser, getUserById,updateUser}
