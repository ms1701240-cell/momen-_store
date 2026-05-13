import mongoose from "mongoose";

const feedback=new mongoose.Schema({
    Email:{type:String,required:true,lowercase: true},
    rate:{type:Number,required:true},
    Comments:{type:String,required:true}
},{timestamps:true})

export default mongoose.model('feedclothes',feedback)