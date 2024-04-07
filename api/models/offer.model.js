import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  typeClasses: {
    type: Array,
    require: true,
  },
  level: {
    type: Array,
    require: true,
  },
  subject: {
    type: Object,
    require: true,
  },
  gender: {
    type: Object,
    require: true,
  },
  education: {
    type: Object,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  phoneNumber: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
    require: true,
  },
  teacherName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  priceRange: {
    type: String,
    require: true,
  }
}, {timestamps: true});

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;
