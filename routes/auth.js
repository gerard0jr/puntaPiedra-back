const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')
const nodemailer = require('nodemailer')
let jwt = require('jsonwebtoken')

router.post('/signup', (req,res,next) => {
  User.register(req.body, req.body.password)
    .then(user => {
        let payload = {
            id: user._id
        }
        let token = jwt.sign(payload, process.env.JWT, {expiresIn: 1000*60*60*24})  
        res.status(201).json({
            message: 'Logged in', 
            token, 
            userInfo: {
              name: user.name,
              verified: user.verified,
              profilePicture: user.profilePicture
            }
        })
    })
    .catch(err => res.status(500).json(err))
})

router.post('/login', (req,res,next) =>{
  passport.authenticate('local', (err,user,info) => {
    if(err) return res.status(500).json(info)
    if(!user) return res.status(403).json(info)
    req.login(user, () => {
      let payload = {
        id: user._id
      }
      let token = jwt.sign(payload, process.env.JWT, {expiresIn: 1000*60*60*24})
      res.status(200).json({
        message: 'Logged in', 
        token, 
        userInfo: {
          name: user.name,
          verified: user.verified,
          profilePicture: user.profilePicture
        }
      })
    })
  })(req,res,next)
})

router.post('/token', (req,res,next) =>{
  const { body } = req
  if(!body.email) return res.status(400).json('Email needed')
  User.findOne({email: body.email})
  .then(user => {
    if(!user) return res.status(404).json('User not found')
    let token
    if(Date.now() > user.resetPasswordExpires || !user.resetPasswordExpires){
      token = Math.floor(10000 + Math.random() * 90000)
      expires = Date.now() + (1000 * 60 * 60 * 2) // 1000 ms * 60 sec * 60min * 2hours
      user.resetPasswordToken = token
      user.resetPasswordExpires = expires
    }else{
      token = user.resetPasswordToken
      expires = user.resetPasswordExpires
    }
    
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls:{
            rejectUnauthorized:false  // if on local
        }
    })

    const mailOptions = {
      from: 'app@puntapiedra.com',
      to: body.email,
      subject: 'Código para tu cuenta de Punta Piedra',
      html : `
        <div>
            <p>Hola ${user.name},</p>
            <p>Tu código es: <b>${token}</b> (Válido por 2 horas)</p>
            <p>Si tienes algún problema, manda un correo a <a href="mailto:contacto@puntapiedra.com">contacto@puntapiedra.com</a></p>
            <p style="font-size: 12px; margin: 2rem 0;">No responder a este correo</p>
            <img width="150px" height="auto" src="https://app.puntapiedra.com/logo.png" alt="Punta Piedra Logo">
        </div>
      `
    }
    transporter.sendMail(mailOptions, (err,response) => {
      if(response) return console.log(response)
      if (err) return console.log(err)
    })

    User.findOneAndUpdate({email: body.email}, user)
      .then(response => {
        res.status(200).json(response)
      })
  })
  .catch(err => res.status(500).json(err))

})


router.post('/checkCode', (req,res) => {
  const { body } = req
  User.findOne({email: body.email})
    .then(user => {
      if(!user) return res.status(404).json('User not found')
      if(Date.now() > user.resetPasswordExpires || !user.resetPasswordExpires) return res.status(400).json('Token expired or missing')
      if(parseInt(body.code) === user.resetPasswordToken){
        return User.findOneAndUpdate({email: body.email}, {verified: true, resetPasswordToken: undefined, resetPasswordExpires: undefined}, {new: true})
          .then(response => res.status(200).json('Código correcto'))
          .catch(err => res.status(501).json('Error en el servidor'))
      }
      return res.status(404).json('Código incorrecto')
    })
    .catch(err => res.status(500).json(err))
})

router.post('/checkPasswordCode', (req,res) => {
  const { body } = req
  User.findOne({email: body.email})
    .then(user => {
      if(!user) return res.status(404).json('User not found')
      if(Date.now() > user.resetPasswordExpires || !user.resetPasswordExpires) return res.status(400).json('Token expired or missing')
      if(parseInt(body.code) === user.resetPasswordToken) return res.status(200).json('Código correcto')
      return res.status(404).json('Código incorrecto')
    })
    .catch(err => res.status(500).json(err))
})

router.post('/changePassword', (req,res) => {
  const { body } = req
  User.findOne({email: body.email})
  .then(user => {
    user.setPassword(body.password)
      .then(newUser => {
        newUser.resetPasswordExpires = undefined
        newUser.resetPasswordToken = undefined
        user.save()
          .then(res.status(200).json('Contraseña actualizada'))
          .catch(err => res.status(400).json('No se pudo cambiar la contraseña'))
      })
  })
  .catch(err => res.status(500).json(err))
})

router.get('/logout', (req,res,next) => {
  req.logout()
  return res.status(200).json({message: 'Succesfully logged out'})
})

router.post('/updateUser/:id', (req,res,next) => {
  const { id } = req.params
  User.findByIdAndUpdate(id, {$set:req.body}, {new: true})
  .then(user => res.status(201).json(user))
  .catch(err => res.status(500).json(err))
})

module.exports = router