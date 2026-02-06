import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'

const addDoctor = async(req,res)=>{
    console.log('--- ADD DOCTOR API HIT ---')
console.log('HEADERS:', req.headers)
console.log('BODY:', req.body)
console.log('FILE:', req.file)


    try{
        const {name,email,password,speciality,degree,experience,about,fees,address}=req.body

        const imageFile=req.file

        if(!name || !email || !password || !speciality || ! degree || !experience || !about || !fees || !address)
        {
            return res.json({success:false, message:"Missing Details"})
        }

        //validating email
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter valid email"})
        }

        //validating strong pass
        if(password.length<5)
        {
            return res.json({success:false, message:"Please Enter a strong password"})
        }

        //hashing doctor pass
        const salt= await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        //upload image to cloudinary
        const imageUpload= await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl =imageUpload.secure_url

        const doctorData = {
      name,
      email,
      image: imageUpload.secure_url,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees: Number(fees),
      address: JSON.parse(address),
      date: Date.now()
    }

        const newDoctor=new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true, message:"Doctor Added"})
    }catch(error){
            console.log(error)
            if (error.code === 11000) {
  return res.status(400).json({
    success: false,
    message: 'Doctor with this email already exists'
  })
}

res.status(500).json({
  success: false,
  message: 'Failed to add doctor'
})

    }
}

//API for admin login

const loginAdmin= async(req,res)=>{
    try{
        const {email,password}=req.body
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD)
        {
             const token=jwt.sign(email+password,process.env.JWT_SECRET)
             res.json({success:true,token})
        }else
        {
            res.json({success:false, message:'Inavlid CRED'})
        }
    }
    catch(error)
    {
        console.log(error)
        res.json({success:false,message:error})
    }
}

//API to get all doctors list

const allDoctors= async(req,res)=>{
    try{

        const doctors=await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    }catch(error)

    {
        console.log(error)
        res.json({success:false,message:error})
    }
}

export {addDoctor,loginAdmin,allDoctors}