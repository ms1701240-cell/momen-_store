import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import { getuserprofile, inputs, logincart, loginer, shower, signer, updatecart, verifytoken } from './controller.js';

dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI) // شيل الـ family: 4 وجرب اللينك اللي بعتهولك فوق
.then(() => console.log('sucess'))
.catch((err) => {
    console.log('erro connection details:', err.reason ? err.reason : err);
});
app.post('/inputfeeds',inputs)
app.get('/showpost',shower)

app.post('/inputsign',signer)
app.post('/logininput',loginer)

app.get('/showperson/',verifytoken,getuserprofile)

app.post('/cartsaved',verifytoken,updatecart)

app.get('/logincart/',verifytoken,logincart)
app.listen(process.env.PORT || 7000, () => console.log('Server is running on port 7000'));