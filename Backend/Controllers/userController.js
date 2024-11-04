const {Users} = require('../Models/UsersModel')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const registerUser = async(req,res)=>{
    try{
     const {name,email,phoneNumber,password} = req.body
     if(!name || !email || !phoneNumber || !password ){
        return res.status(400).json('All Fields Are Required')
     }
     const findIfUserExist = await Users.findOne({email})
     if(findIfUserExist){
        return res.status(400).json('User Already Exist')
     }
      const isEmail = validator.isEmail(email)
      if(!isEmail){
       return res.status(400).json('Invalid Email Address')
      }
      const hashedPassword = await bcrypt.hash(password,8)
      const newUser = new Users({
        name:name,
        email:email,
        phoneNumber: phoneNumber,
        password:hashedPassword,
       
      })
      await newUser.save()
      const access_token = jwt.sign({id:newUser._id,role:newUser.role},process.env.JWT_ACCESS_TOKEN, {expiresIn:'1d'})
      res.cookie("accessToken",access_token,{httpOnly:true,sameSite:'strict',secure:'false'})
      res.status(200).json('Sign Up Successful')

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }

}

const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body
        if(!email || !password){
          return res.status(400).json('All fields are required')
        }
        const user = await Users.findOne({email})
        if(!user){
            return res.status(400).json('Did not find an account')
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json('Invalid email or Password')
        }
        const access_token = jwt.sign({id:user._id,role:user.role},process.env.JWT_ACCESS_TOKEN, {expiresIn:"1d"})
        console.log(access_token)
        res.cookie('accessToken',access_token,{httpOnly:true,sameSite:"strict",secure:false})
        res.status(200).json('Login Successful')

    }catch(err){
        console.log(err)
        res.status(500).json("Internal Server Error")
    }

}
const loginSeller = async(req,res)=>{
    try{
        const {email,password} = req.body
        if(!email || !password){
          return res.status(400).json('All fields are required')
        }
        const user = await Users.findOne({email})
        if(!user){
            return res.status(400).json('Did not find an account')
        }
        if(!user.role ==='Seller'){
            return res.status(401).json('Unauthorized Access')
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json('Invalid email or Password')
        }
        const access_token = jwt.sign({id:user._id,role:user.role},process.env.JWT_ACCESS_TOKEN, {expiresIn:"1d"})
        res.cookie('accessToken',access_token,{httpOnly:true,sameSite:"strict",secure:false})
        res.status(200).json('Login Successful')

    }catch(err){
        console.log(err)
        res.status(500).json("Internal Server Error")
    }

}

const getProfile = async(req,res)=>{
    try{
        const userId = req.user.id
        const user = await Users.findById(userId)
        if(user){
          return  res.status(200).json(user)
        }
        else{
          return res.status(404).json("User not found")
        }

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }

}

const updateProfile = async(req,res)=>{
    try{
    const userId = req.user.id
    const profileImage = req.file?req.file.filename : null
    await Users.findByIdAndUpdate(userId,req.body,{ profileImage: profileImage})
    res.status(200).json('Update Successful')
    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

module.exports = {registerUser,loginUser,getProfile,updateProfile,loginSeller}