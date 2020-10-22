const router = require('express').Router()
const House = require('../models/House')
let jwt = require('jsonwebtoken')

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
    console.log(houseData)
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