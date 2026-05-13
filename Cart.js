import mongoose from "mongoose";

const cartprod = new mongoose.Schema({
    userid: { type: String, required: true, unique: true },
    products: [ // لاحظ القوسين دول عشان تبقى مصفوفة
        {
            name: String,
            prize: Number,
            img: String,
            qty: { type: Number, default: 1 }
        }
    ]
});
const cartstorge=mongoose.model('prods',cartprod)
export default cartstorge