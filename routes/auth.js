const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')
const { SocketLabsClient, EmailAddress } = require('@socketlabs/email')

const serverId = process.env.SOCKET_SERV_ID
const injectionApiKey = process.env.SOCKET_KEY

let jwt = require('jsonwebtoken')

router.post('/signup', (req,res,next) => {
  User.register(req.body, req.body.password)
    .then(user => {
        let payload = {
            id: user._id
        }
        let token = jwt.sign(payload, process.env.JWT, {expiresIn: 1000*60*60*24})
        // EMAIL
        const client = new SocketLabsClient(parseInt(serverId), injectionApiKey)
        let fromEmail = new EmailAddress("sistema@puntapiedra.com", { friendlyName: "Punta Piedra" })

        const message = {
          to: req.body.email,
          from: fromEmail,
          subject: "Villas de Punta Piedra",
          htmlBody: `
          <html>
              <body>
              <div style="background-color: #FFFFFF; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                  <div style="padding: 1rem 2rem;max-width: 500px;margin: 0 auto;background-color: #F6F6F6;">
                      <h2>Welcome to your Punta Piedra's account</h2>
                      <h2 style="color: #BABABA">Bienvenido tu cuenta en Punta Piedra</h2>
                      <p class="mail-title">What's next?</p>
                      <p style="color: #BABABA" class="mail-title">¿Qué sigue?</p>
                      <p>Login into your account and start managing your profile</p>
                      <p style="color: #BABABA">inicia sesión en tu cuenta y empeza a configurar tu perfil</p>
                      <p><a style='text-decoration: none;' href="https://app.puntapiedra.com">app.puntapiedra.com</a></p>
                  </div>
              </div>
              </body>
          </html>
          `,
          messageType: 'basic'
        }

        client.send(message)
          .then(success => {
            console.log(success)
            User.findOneAndUpdate({email: req.body.email}, user)
              .then(user => res.status(201).json({
                message: 'Logged in', 
                token, 
                userInfo: {
                  _id: user._id,
                  name: user.name,
                  verified: user.verified,
                  profilePicture: user.profilePicture,
                  userType: user.userType,
                  language: user.language,
                  email: user.email,
                  customerAgent: user.customerAgent
                }
              }))
              .catch(err => res.status(500).json(err))
          })
          .catch(err => {
            console.log(err)
            res.status(500).json(err)
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
          profilePicture: user.profilePicture,
          userType: user.userType,
          language: user.language,
          email: user.email
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
    
    const client = new SocketLabsClient(parseInt(serverId), injectionApiKey)
    let fromEmail = new EmailAddress("sistema@puntapiedra.com", { friendlyName: "Punta Piedra" })

    const message = {
      to: req.body.email,
      from: fromEmail,
      subject: "Villas de Punta Piedra",
      htmlBody: `
      <html>
          <body>
          <div style="background-color: #FFFFFF; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
              <div style="padding: 1rem 2rem;max-width: 500px;margin: 0 auto;background-color: #F6F6F6;">
                  <h2>Access code for your Punta Piedra's account</h2>
                  <h2 style="color: #BABABA">Código de acceso para tu cuenta en Punta Piedra</h2>
                  <p class="mail-title">What's next?</p>
                  <p style="color: #BABABA" class="mail-title">¿Qué sigue?</p>
                  <p>Don't share this code with anyone</p>
                  <p style="color: #BABABA">No compartas el código a nadie</p>
                  <p style="background-color: #60C300;color: #FFFFFF;width: 60px;margin: 2em auto;padding: 1em;font-weight: bold;">${token}</p>
                  <p><a style='text-decoration: none;' href="https://app.puntapiedra.com">app.puntapiedra.com</a></p>
              </div>
          </div>
          </body>
      </html>
      `,
      messageType: 'basic'
    }

    client.send(message)
      .then(success => {
        console.log(success)
        User.findOneAndUpdate({email: body.email}, user)
          .then(response => res.status(200).json(response))
          .catch(err => res.status(500).json(err))
      })
      .catch(err => {
        console.log(err)
        res.status(500).json(err)
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

router.post('/updateUser', (req,res,next) => {
  const { _id } = req.body
  User.findByIdAndUpdate(_id, {$set:req.body}, {new: true})
  .then(user => res.status(201).json(user))
  .catch(err => res.status(500).json(err))
})

router.post('/linkAgent', (req,res) => {
  const { agentId, userId } = req.body
    User.findByIdAndUpdate(agentId, {$push: {clients: userId}})
      .then(agent => res.status(200).json(agent))
      .catch(err => res.status(501).json(err))
})

module.exports = router