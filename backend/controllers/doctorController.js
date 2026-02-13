import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"


const changeAvailability=async(req,res)=>{

    try {
        
        const {docId}=req.body
        const docData=await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true, message:'Availability Changed'})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error})
    }

}

const doctorList =async(req,res)=>{
    try {
        const doctors=await doctorModel.find({}).select(['-password','-email'])

        res.json({success:true,doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error})
    }
}


const loginDoctor= async(req,res)=>{

    try {
        
        const {email,password}=req.body
        const doctor= await doctorModel.findOne({email})

        if(!doctor){
            return res.json({success:false, message:"Invalid Cred"})
        }

        const isMatch=await bcrypt.compare(password, doctor.password)

        if(isMatch){

            const token= jwt.sign({id:doctor._id},process.env.JWT_SECRET)

            res.json({success:true,token})
        }
        else{
            return res.json({success:false, message:"Wrong Password"})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error})
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.docId   // ✅ FROM authDoctor middleware

    const appointments = await appointmentModel.find({ docId })

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

//API to mark appointment completed

const appointmentComplete = async(req,res)=>{

    try {
        const docId = req.docId 
        const {appointmentId}=req.body

            if (!appointmentId) {
      return res.json({
        success: false,
        message: 'Appointment ID missing'
      })
    }

        const appointmentData=await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId.toString() === docId)
        {
            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
            return res.json({success:true,message:"Appointment Completed"})
        }else{
            return res.json({success:false,message:"Mark failed"})
        }

    } catch (error) {
        console.log(error)
    res.json({
      success: false,
      message: error.message
    })
    }
}


//API to cancel appointment completed

const appointmentCancel = async(req,res)=>{

    try {
        const docId = req.docId 
        const {appointmentId}=req.body

            if (!appointmentId) {
      return res.json({
        success: false,
        message: 'Appointment ID missing'
      })
    }

        const appointmentData=await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId.toString() === docId)
        {
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
            return res.json({success:true,message:"Cancel Completed"})
        }else{
            return res.json({success:false,message:"Cancel failed"})
        }

    } catch (error) {
        console.log(error)
    res.json({
      success: false,
      message: error.message
    })
    }
}


//API to get dashboard for doctor panel


export {changeAvailability,doctorList, loginDoctor,appointmentsDoctor ,appointmentCancel,appointmentComplete}