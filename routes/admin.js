const router = require('express').Router()
const House = require('../models/House')
let jwt = require('jsonwebtoken')
const User = require('../models/User')
const Message = require('../models/Message')
const { SocketLabsClient, EmailAddress } = require('@socketlabs/email')

const serverId = process.env.SOCKET_SERV_ID
const injectionApiKey = process.env.SOCKET_KEY

router.post('/getSingleMessage', (req,res,next) => {
    const { id } = req.body
    Message.findById(id)
        .then(message => res.status(200).json(message))
        .catch(err => res.status(500).json(err))
})

router.post('/getAllMessages', (_,res) => {
    Message.find()
        .then(messages => res.status(200).json(messages))
        .catch(err => res.status(500).json(err))
})

router.post('/getMessages', (req,res,next) => {
    const { email } = req.body
    User.findOne({email}).populate('messages')
        .then(user => res.status(200).json({messages: user.messages}))
        .catch(err => res.status(500).json(err))
})

router.post('/sendQuestion', (req,res,next) => {
    const { email, question } = req.body
        Message.create({question})
        .then(message => 
            User.findOneAndUpdate({email}, {$push: {messages: message._id}}, {new: true})
                .then(user => {
                    Message.findByIdAndUpdate(message._id, {$set: {user: user._id, agent: user.customerAgent}}, {new: true})
                    .then(message => res.status(200).json(message))
                })
                .catch(err => res.status(501).json(err))
        )
        .catch(err => res.status(500).json(err))
})

router.post('/sendAdminMessage', (req,res,next) => {
    const { id, message } = req.body
    const client = new SocketLabsClient(parseInt(serverId), injectionApiKey)
    let fromEmail = new EmailAddress("sistema@puntapiedra.com", { friendlyName: "Punta Piedra" })
    Message.findByIdAndUpdate(id, {$push: {answers: {agent: message}}}, {new: true}).populate('user')
        .then(response => {
            let {user} = response
            mailMessage = {
                to: user.email,
                from: fromEmail,
                subject: `Question answered`,
                htmlBody: `
                <html>
                    <body>
                    <div style="background-color: #FFFFFF; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                        <div style="padding: 1rem 2rem;max-width: 500px;margin: 0 auto;background-color: #F6F6F6;">
                            <h2>Punta Piedra</h2>
                            <p class="mail-title">${user.name} ${user.lastName} your question was answered by your agent</p>
                            <p style="color: #BABABA" class="mail-title">${user.name} ${user.lastName} tu agente respondió tu pregunta</p>
                            <p>Review answer:</p>
                            <p><a style='text-decoration: none;' href="https://app.puntapiedra.com">app.puntapiedra.com</a></p>
                        </div>
                    </div>
                    </body>
                </html>
                `,
                messageType: 'basic'
            }
            client.send(mailMessage)
                .then(success => {
                    console.log(success)
                    res.status(201).json(response)
                })
                .catch(err => {
                    console.log(err)
                    res.status(501).json(err)
                })
        })
        .catch(err => res.status(501).json(err))
})

router.post('/sendMessage', (req,res,next) => {
    const { id, message } = req.body
    const client = new SocketLabsClient(parseInt(serverId), injectionApiKey)
    let fromEmail = new EmailAddress("sistema@puntapiedra.com", { friendlyName: "Punta Piedra" })
    Message.findByIdAndUpdate(id, {$push: {answers: {user: message}}}, {new: true}).populate('agent').populate('user')
        .then(response => {
            let {user, agent} = response
            mailMessage = {
                to: agent.email,
                from: fromEmail,
                subject: `Your client ${user.name} ${user.lastName} sent you a message`,
                htmlBody: `
                <html>
                    <body>
                    <div style="background-color: #FFFFFF; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                        <div style="padding: 1rem 2rem;max-width: 500px;margin: 0 auto;background-color: #F6F6F6;">
                            <h2>Punta Piedra</h2>
                            <p class="mail-title">${user.name} ${user.lastName} sent you a message</p>
                            <p style="color: #BABABA" class="mail-title">${user.name} ${user.lastName} te envió un mensaje</p>
                            <p>Review message:</p>
                            <p><a style='text-decoration: none;' href="https://app.puntapiedra.com">app.puntapiedra.com</a></p>
                        </div>
                    </div>
                    </body>
                </html>
                `,
                messageType: 'basic'
            }
            client.send(mailMessage)
                .then(success => {
                    console.log(success)
                    res.status(201).json(response)
                })
                .catch(err => {
                    console.log(err)
                    res.status(502).json(err)
                })
        })
        .catch(err => res.status(501).json(err))
})

router.post('/getHouse', (req,res,next) => {
    const { id, houseId } = req.body
    if(id){
        jwt.verify(id, process.env.JWT, (err, decoded) => {
            if(err) return res.status(401).json({message: 'Token inválido'})
            House.findById(houseId)
                .then(house => res.status(200).json(house))
                .catch(err => res.status(500).json(err))
        })
    } else res.status(404).json({message: 'No hay token'})
})

router.post('/addHouse', (req,res,next) => {
    const { id, houseData } = req.body
    if(id){
        jwt.verify(id, process.env.JWT, (err, decoded) => {
            if(err) return res.status(401).json({message: 'Token inválido'})
            House.create(houseData)
                .then(house => res.status(201).json(house))
                .catch(err => res.status(500).json(err))
        })
    } else res.status(404).json({message: 'No hay token'})
})

module.exports = router