import mongoose from "mongoose";

const prods=new mongoose.Schema({
   name: { type: String, required: true },      // بدل title عشان أنت كاتب item.name                  // الوصف القصير اللي تحت الاسم
    prize: { type: Number, required: true },     // أنت كاتبها prize بالـ z مش price
    img: { type: String, required: true },       // أنت كاتبها img مش image                // الجودة
    size: { type: String },                     // المقاس
    category: { type: String, required: true },  // القسم
}, { timestamps: true });