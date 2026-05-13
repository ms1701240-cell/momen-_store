import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
const users=new mongoose.Schema({
    Username: { type: String, required: true },
    Email: { type: String, required: true, lowercase: true, unique: true },
    Password: { type: String, required: true },
    Phone:{type: String, required: true }
})
users.pre('save',async function() {
    if(!this.isModified('Password')){
        return
    }
    const salt= await bcrypt.genSalt(10);
    this.Password=await bcrypt.hash(this.Password,salt)
})

const signupuser= mongoose.model('userstore',users)
export default signupuser;