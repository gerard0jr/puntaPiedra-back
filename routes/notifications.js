const router = require('express').Router()
const User = require('../models/User')
const { SocketLabsClient, EmailAddress } = require('@socketlabs/email')

const serverId = process.env.SOCKET_SERV_ID
const injectionApiKey = process.env.SOCKET_KEY

router.post('/send', (req,res) => {
    let { email, data } = req.body
    const client = new SocketLabsClient(parseInt(serverId), injectionApiKey)
    let fromEmail = new EmailAddress("sistema@puntapiedra.com", { friendlyName: "Punta Piedra" })
    let message = {}
    User.findOne({email})
        .then(user => {
            switch(data){
                case ('passport' || 'driversLicence' || 'addressProof'):
                    message = {
                        to: 'sistema@puntapiedra.com',
                        from: fromEmail,
                        subject: `Your client ${user.name} ${user.lastName} has uploaded a document`,
                        htmlBody: `
                        <html>
                            <body>
                            <div style="background-color: #FFFFFF; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                                <div style="padding: 1rem 2rem;max-width: 500px;margin: 0 auto;background-color: #F6F6F6;">
                                    <h2>Punta Piedra</h2>
                                    <p class="mail-title">${user.name} ${user.lastName} uploaded a file: ${
                                        data === 'passport' ? 'Passport' :
                                        data === 'driversLicence' ? 'Drivers Licence' :
                                        data === 'addressProof' ? 'Proof of address' : 
                                        ''
                                    }</p>
                                    <p style="color: #BABABA" class="mail-title">${user.name} ${user.lastName} subió un archivo: ${
                                        data === 'passport' ? 'Pasaporte' :
                                        data === 'driversLicence' ? 'Licencia de manejo' :
                                        data === 'addressProof' ? 'Comprobante de domicilio' : 
                                        ''
                                    }</p>
                                    <p>Review document:</p>
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
                            res.status(200).json({message: 'message sent'})
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(501).json(err)
                        })
                    break
                case 'intDesign':
                    message = {
                        to: 'sistema@puntapiedra.com',
                        from: fromEmail,
                        subject: `Your client ${user.name} ${user.lastName} has chosen the finishes`,
                        htmlBody: `
                        <html>
                            <body>
                            <div style="background-color: #FFFFFF; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                                <div style="padding: 1rem 2rem;max-width: 500px;margin: 0 auto;background-color: #F6F6F6;">
                                    <h2>Punta Piedra</h2>
                                    <p class="mail-title">${user.name} ${user.lastName} has chosen the finishes of the villa</p>
                                    <p style="color: #BABABA" class="mail-title">${user.name} ${user.lastName} escogió los acabados de la residencia</p>
                                    <p>Review document:</p>
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
                            res.status(200).json({message: 'message sent'})
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(501).json(err)
                        })
                    break
                case 'document':
                    message = {
                        to: 'sistema@puntapiedra.com',
                        from: fromEmail,
                        subject: `Your client ${user.name} ${user.lastName} has uploaded a document`,
                        htmlBody: `
                        <html>
                            <body>
                            <div style="background-color: #FFFFFF; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                                <div style="padding: 1rem 2rem;max-width: 500px;margin: 0 auto;background-color: #F6F6F6;">
                                    <h2>Punta Piedra</h2>
                                    <p class="mail-title">${user.name} ${user.lastName} uploaded a document for the financial application</p>
                                    <p style="color: #BABABA" class="mail-title">${user.name} ${user.lastName} subió un archivo a la aplicación de financiamiento</p>
                                    <p>Review document:</p>
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
                            res.status(200).json({message: 'message sent'})
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(501).json(err)
                        })
                    break
                case 'finishProfile':
                    message = {
                        to: 'sistema@puntapiedra.com',
                        from: fromEmail,
                        subject: `Your client ${user.name} ${user.lastName} has finished his/her profile`,
                        htmlBody: `
                        <html>
                            <body>
                            <div style="background-color: #FFFFFF; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                                <div style="padding: 1rem 2rem;max-width: 500px;margin: 0 auto;background-color: #F6F6F6;">
                                    <h2>Punta Piedra</h2>
                                    <p class="mail-title">${user.name} ${user.lastName} finished his/her profile successfully</p>
                                    <p style="color: #BABABA" class="mail-title">${user.name} ${user.lastName} ha completado su perfil satisfactoriamente</p>
                                    <p>Review user:</p>
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
                            res.status(200).json({message: 'message sent'})
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(501).json(err)
                        })
                    break
                case 'buyHouse':
                    message = {
                        to: 'sistema@puntapiedra.com',
                        from: fromEmail,
                        subject: `Your client ${user.name} ${user.lastName} approved the purchase of a villa`,
                        htmlBody: `
                        <html>
                            <body>
                            <div style="background-color: #FFFFFF; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                                <div style="padding: 1rem 2rem;max-width: 500px;margin: 0 auto;background-color: #F6F6F6;">
                                    <h2>Punta Piedra</h2>
                                    <p class="mail-title">${user.name} ${user.lastName} has approved the purchase of a villa</p>
                                    <p style="color: #BABABA" class="mail-title">${user.name} ${user.lastName} ha aprobado la compra de una residencia</p>
                                    <p>Review user:</p>
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
                            res.status(200).json({message: 'message sent'})
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(501).json(err)
                        })
                    break
                case 'chooseHouse':
                    message = {
                        to: 'sistema@puntapiedra.com',
                        from: fromEmail,
                        subject: `Your client ${user.name} ${user.lastName} chose a house`,
                        htmlBody: `
                        <html>
                            <body>
                            <div style="background-color: #FFFFFF; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                                <div style="padding: 1rem 2rem;max-width: 500px;margin: 0 auto;background-color: #F6F6F6;">
                                    <h2>Punta Piedra</h2>
                                    <p class="mail-title">${user.name} ${user.lastName} has chosen a house</p>
                                    <p style="color: #BABABA" class="mail-title">${user.name} ${user.lastName} ha escogido una casa</p>
                                    <p>Review user:</p>
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
                            res.status(200).json({message: 'message sent'})
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(501).json(err)
                        })
                    break
                case 'profile':
                    message = {
                        to: 'sistema@puntapiedra.com',
                        from: fromEmail,
                        subject: `Your client ${user.name} ${user.lastName} finished a step`,
                        htmlBody: `
                        <html>
                            <body>
                            <div style="background-color: #FFFFFF; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                                <div style="padding: 1rem 2rem;max-width: 500px;margin: 0 auto;background-color: #F6F6F6;">
                                    <h2>Punta Piedra</h2>
                                    <p class="mail-title">${user.name} ${user.lastName} has configured the profile</p>
                                    <p style="color: #BABABA" class="mail-title">${user.name} ${user.lastName} ha configurado su perfil</p>
                                    <p>Review user:</p>
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
                            res.status(200).json({message: 'message sent'})
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(501).json(err)
                        })
                    break
                case 'financeForm':
                    message = {
                        to: 'sistema@puntapiedra.com',
                        from: fromEmail,
                        subject: `${user.name} ${user.lastName} uploaded a financial form`,
                        htmlBody: `
                        <html>
                            <body>
                            <div style="background-color: #FFFFFF; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                                <div style="padding: 1rem 2rem;max-width: 500px;margin: 0 auto;background-color: #F6F6F6;">
                                    <h2>Punta Piedra</h2>
                                    <p class="mail-title">${user.name} ${user.lastName} has finished the financial application</p>
                                    <p style="color: #BABABA" class="mail-title">${user.name} ${user.lastName} ha terminado su aplicación para financiemiento</p>
                                    <p>Don't forget to review the application</p>
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
                            res.status(200).json({message: 'message sent'})
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(501).json(err)
                        })
                    break
                default:
                    res.status(500).json({message: 'incorrect data'})
                    break
            }
        })
})

module.exports = router