import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from "../models/User.js"

//? REGISTER USER kayıt
/* req: frontend den alınan bilgi ile res cevap verecek */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body

    const salt = await bcrypt.genSalt()  // random salt oluşturacak.
    const passwordHash = await bcrypt.hash(password, salt) //ayrıştırdığı şifre karşılaştırması yapılacak

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000)
    })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
    //*Şifreyi kaydettikten sonra user şifreyi denediğinde karşılaştırma yapılacak. 
    //*sonucunda json web verilecek
    
  } catch (err) {
    res.status(500).json({error: err.message})
  }
}

/* LOGGING IN giriş*/
export const login = async (req, res) => {
  try {
    const {email, password} = req.body
    const user = await User.findOne({email:email})
    //Eğer kullanıcı yoksa hata mesajını döndürecektir.
    if(!user) return res.status(400).json({msg:"User does not exist. "})
    //eşleşen kullanıcının parolası kontrol edilecek.
    const isMatch = await bcrypt.compare(password , user.password)
    if(!isMatch) return res.status(400).json({msg:"Invalid credentials. "})

    // eşleşme var ise token üretilecek ve client tarafında sessiona atılacağı için cookie olarak gön
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password
    res.status(200).json({token,user})
  } catch (err) {
    res.status(500).json({error: err.message})
  }
}