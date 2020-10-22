const router = require('express').Router()
const User = require('../models/User')
const House = require('../models/House')
let jwt = require('jsonwebtoken')

router.post('/getData', (req,res,next) => {
    const { id } = req.body
    if(id){
        jwt.verify(id, process.env.JWT, (err, decoded) => {
            if(err) return res.status(401).json({message: 'Token inválido'})
            let { id } = decoded
            User.findById(id)
                .then(user => {
                    let {
                        active, 
                        verified, 
                        allowNewsletter, 
                        createdAt, 
                        updatedAt, 
                        resetPasswordExpires, 
                        resetPasswordToken,
                        ...filteredUser
                    } = user 
                    res.status(200).json(filteredUser._doc)
                })
                .catch(err => res.status(500).json(err))
        })
    } else res.status(404).json({message: 'No hay token'})
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

module.exports = router