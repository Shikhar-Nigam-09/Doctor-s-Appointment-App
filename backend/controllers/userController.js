

import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'

import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'
import crypto from "crypto"




//API to register user

const registerUser=async(req,res)=>{

    try {
        const {name,email,password}=req.body

        if(!name || !email || !password)
        {
            return res.json({success:false,message:"missing details"})

        }
        if(!validator.isEmail(email))
        {
            return res.json({success:false,message:"Enter a valid email"})
        }
        if(password.length<6)
        {
            return res.json({success:false,message:"Enter strong password"})
        }

        //hashing password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt)

        const userData={
            name,
            email,
            password:hashedPassword
        }

        const newUser= new userModel(userData)
        const user = await newUser.save()

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({success:true,token})




    } catch (error) {
        console.log(error)
        res.json({success:false,message:error})
    }
}

//API for user Login
const loginUser=async(req,res)=>{
    try {
        
        const {email,password}=req.body
        const user=await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"User does not exist"})
        }

        const isMatch= await bcrypt.compare(password,user.password)

        if(isMatch)
        {
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid Cred"})
        }
    } catch (error) {
         console.log(error)
        res.json({success:false,message:error})
    }
}

//API to get user profile data

const getProfile=async (req,res)=>{
    try {
       const userId = req.userId   
       const userData= await userModel.findById(userId).select('-password')

       res.json({success:true,userData})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error})
    }
}

//API to update user profile

const updateProfile=async(req,res)=>{
    try {
        

        const {userId,name,phone,address,dob,gender}=req.body

        const imageFile=req.file
        if(!name|| !phone  || !dob ||  !gender){
            return res.json({success:false,message:"Data missing"})
        }

        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})

        if(imageFile)
        {
            //upload image to cloudinary

            const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})

            const imageURL=imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }

        res.json({success:true,message:"profile updated"})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error})
    }
}

//API to book the appointment
const bookAppointment =async(req,res)=>{
    try {
      const { docId, slotDate, slotTime}=req.body
      const userId = req.userId
      
      const docData= await doctorModel.findById(docId).select('-password')

      if(!docData.available){
        return res.json({success:false,message:"Doctor not available"})
      }
      let slots_booked=docData.slots_booked

      //checking for slot availability
      if(slots_booked[slotDate])
      {
        if(slots_booked[slotDate].includes(slotTime)){
            return res.json({success:false,message:"Slot not available"})
        }else{
            slots_booked[slotDate].push(slotTime)
        }
      }else{
        slots_booked[slotDate]=[]
        slots_booked[slotDate].push(slotTime)
      }

      const userData=await userModel.findById(userId).select('-password')

      delete docData.slots_booked

      const appointmentData={
        userId,
        docId,
        userData,
        docData,
        amount:docData.fees,
        slotTime,
        slotDate,
        date:Date.now()

      }

      const newAppointment= new appointmentModel(appointmentData)

      await newAppointment.save()

      //save new slots data in doctors data
      await doctorModel.findByIdAndUpdate(docId,{slots_booked})

      res.json({success:true,message:"Appointment booked"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error})
    }
}

//API to get user appointments for fronend myappointments page

// API to get user appointments for frontend myappointments page
const listAppointments = async (req, res) => {
  try {
    const userId = req.userId          // ✅ FIX 1

    const appointments = await appointmentModel
      .find({ userId })               // ✅ FIX 2 (await)
      .lean()                         // ✅ FIX 3 (plain JS objects)

    res.json({
      success: true,
      appointments
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}


//APi to cancel appointment

const cancelAppointment= async(req,res)=>{
    try {
       const userId = req.userId 
        const {appointmentId}=req.body

        const appointmentData=await appointmentModel.findById(appointmentId)

        //verify appointment user
        if (appointmentData.userId.toString() !== userId) {
  return res.json({
    success: false,
    message: "Unauthorised Action"
  })
}

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        //releasing doctor slot

        const {docId,slotDate,slotTime}=appointmentData

        const doctorData= await doctorModel.findById(docId)

        let slots_booked=doctorData.slots_booked

        slots_booked[slotDate] =
  slots_booked[slotDate].filter(e => e !== slotTime)

if (slots_booked[slotDate].length === 0) {
  delete slots_booked[slotDate]
}

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true, message:"Appointment Cancelled"})

    } catch (error) {
         console.log(error)
    res.json({
      success: false,
      message: error.message
    })
    }
}

//API to make paymeny of appointment using Razorpay

const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})


const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment cancelled or not found"
      });
    }

    // ✅ Options for Razorpay
    const options = {
      amount: appointmentData.amount * 100, // paise
      currency: process.env.CURRENCY,
      receipt: appointmentId
    };

    // ✅ Create order
    const order = await razorpayInstance.orders.create(options);

    return res.json({
      success: true,
      order
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message
    });
  }
};

//API to verify payment of Razorpay



const verifyRazorpay = async (req, res) => {
  try {
    const {
      appointmentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body

    // 1️⃣ Create signature
    const body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex")

    // 2️⃣ Verify signature
    if (expectedSignature !== razorpay_signature) {
      return res.json({
        success: false,
        message: "Invalid payment signature"
      })
    }

    // 3️⃣ Mark appointment as paid
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      payment: true
    })

    res.json({
      success: true,
      message: "Payment verified successfully"
    })

  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}




export {registerUser,loginUser,getProfile,updateProfile, bookAppointment, listAppointments,cancelAppointment, paymentRazorpay,verifyRazorpay}