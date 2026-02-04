import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    image: {
      type: String, // Cloudinary URL
      required: true,
    },

    speciality: {
      type: String,
      required: true,
    },

    degree: {
      type: String,
      required: true,
    },

    experience: {
      type: String, // e.g. "5 Years"
      required: true,
    },

    about: {
      type: String,
      required: true,
    },

    available: {
      type: Boolean,
      required: true,
      default: true,
    },

    fees: {
      type: Number,
      required: true,
    },

    address: {
      line1: {
        type: String,
        required: true,
      },
      line2: {
        type: String,
        required: true,
      },
    },

    date: {
      type: Number, // timestamp (Date.now())
      required: true,
    },

    slots_booked: {
      type: Object,
      default: {}, // { "2024-07-25": ["10:00 AM", "10:30 AM"] }
    },
  },
  {
    minimize: false,
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Prevent model overwrite error in dev
const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;
