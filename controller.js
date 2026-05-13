import feedbacksmodel from './Model.js'
import usersign from './User.js'
import bcrypt from 'bcrypt'
import CartModel from './Cart.js'
import jwt, { decode } from 'jsonwebtoken'
export const inputs=async(req,res)=>{
    try{
           const form=req.body;
          const add=new  feedbacksmodel(form);
            await add.save();
            res.status(200).json({message:'connect sucess'})
    }catch(err){
      res.status(500).json({message:'error',err})
    }
}
export const shower=async(req,res)=>{
    try{
     const finder= await feedbacksmodel.find().sort({_id:-1})
     res.json(finder);
    }catch (err) {
    // السطر ده هيخلينا نشوف الرسالة الحقيقية في المتصفح بدل القوسين الفاضيين
    res.status(500).json({ message: 'error', details: err.message });
}
}
export const signer = async (req, res) => {
    try {
        const inputs = req.body;
        
        // 1. نتأكد إن الإيميل مش موجود قبل كدة عشان ميديناش Error من المونجو
        const existingUser = await usersign.findOne({ Email: inputs.Email });
        if (existingUser) {
            return res.status(400).json({ message: 'الإيميل ده مسجل قبل كدة يا هندسة' });
        }

        const added = new usersign(inputs);
        await added.save();

        // 2. بنعمل التوكن
        const token = jwt.sign(
            { userid: added._id }, 
            'secretkey', 
            { expiresIn: '1d' }
        );

        // 3. الرد النهائي (ده اللي بيخلي الـ 500 تختفي)
        return res.status(200).json({ 
            message: 'done', 
            userid: added._id, 
            token: token 
        });

    } catch (err) {
        console.error("Sign up error:", err);
        // بنبعت الـ error الحقيقي عشان نفهمه
        return res.status(500).json({ message: 'error', details: err.message });
    }
}
export const loginer=async(req,res)=>{
    try{
      const {Email,Password}=req.body;
      const user=await usersign.findOne({Email:Email})
      if(!user){
        return res.status(404).json({message:'Email not foun'})
      }
      const pass=await bcrypt.compare(Password,user.Password)
      if(!pass){
        return res.status(404).json({message:'error password'})
      }
      const token=jwt.sign(
        {userid:user._id},'secretkey',{expiresIn:'1d'}
      );
      res.status(202).json({
        message:'تم بنجاح ',
        token:token,
        userid:user._id
      })
    }catch(err){
         res.status(500).json({message:'error'})
    }
}
export const getuserprofile=async(req,res)=>{
    try{
    const finder=await usersign.findById(req.user.userid).select('-Password')
    res.status(200).json(finder);
    }catch(err){
        res.status(500).json({message:'error'})
    }
}
export const updatecart=async(req,res)=>{
    try{
        const userid=req.user.userid
      const{products}=req.body
      const updatecart=await CartModel.findOneAndUpdate({userid:userid},{products:products},{upsert:true,new:true});
      res.status(200).json(updatecart)
    }catch(err){
      res.status(500).json({message:'error'})
    }
}
export const logincart=async(req,res)=>{
    try{
      const finder=await CartModel.findOne({userid:req.user.userid})
      if(finder){
        res.status(200).json(finder.products);
      }
      else{
         res.status(200).json([]);
      }
    }catch(err){
        res.status(500).json({message:'error'})
    }
}
export const verifytoken=async(req,res,next)=>{
    const token=req.headers['authorization'];
    if(!token){
        return res.status(403).json({ message: "ممنوع الدخول! فين التوكن؟" });
    }
    jwt.verify(token,'secretkey',(err,decoded)=>{
        if(err){
            return res.status(401).json({ message: "التوكن باطل أو منتهي" });
        }
        req.user=decoded
        next()
    })
}