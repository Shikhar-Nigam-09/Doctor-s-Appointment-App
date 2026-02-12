import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'

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

//API to get all appointments list

const appointmentsAdmin= async(req,res)=>{
    try {
        const appointments= await appointmentModel.find({})

        res.json({success:true,appointments})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error})
    }
}

//Api for appointment camcellation

 // ================= CANCEL APPOINTMENT =================
 

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // 1️⃣ Get appointment
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    // 2️⃣ Prevent double cancel
    if (appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment already cancelled",
      });
    }

    // 3️⃣ Mark appointment cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // 4️⃣ Release doctor slot
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    if (doctorData?.slots_booked?.[slotDate]) {
      doctorData.slots_booked[slotDate] =
        doctorData.slots_booked[slotDate].filter(
          (time) => time !== slotTime
        );

      // Remove empty date key
      if (doctorData.slots_booked[slotDate].length === 0) {
        delete doctorData.slots_booked[slotDate];
      }

      await doctorModel.findByIdAndUpdate(docId, {
        slots_booked: doctorData.slots_booked,
      });
    }

    // 5️⃣ Response
    return res.json({
      success: true,
      message: "Appointment cancelled successfully",
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


//API to get dashboard data for admin

const adminDashboard=async(req,res)=>{
    try {
       
      const doctors=await doctorModel.find({})
      
      const users=await userModel.find({})

      const appointments= await appointmentModel.find({})

      const dashData={
        doctors:doctors.length,
        appointments:appointments.length,
        patients:users.length,
        latestAppointments:appointments.reverse().slice(0,5)

      }

      res.json({success:true, dashData})


    } catch (error) {
        console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
    }
}


export {addDoctor,loginAdmin,allDoctors, appointmentsAdmin, appointmentCancel , adminDashboard}