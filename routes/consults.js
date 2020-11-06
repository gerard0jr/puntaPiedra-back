const router = require('express').Router()
const User = require('../models/User')
const House = require('../models/House')
let jwt = require('jsonwebtoken')

router.get('/getAgents', (_,res) => {
    User.find()
        .then(user => {
            let agents = user.filter(user => 
                user.userType === 'agent'
            ).map(agent => ({ 
                _id: agent._id, 
                name: agent.name, 
                lastName: agent.lastName
            }))
            res.status(200).json(agents)
        })
        .catch(err => res.status(500).json(err))
})

router.post('/getLanguage', (req,res) => {
    let { email } = req.body
    User.findOne({email})
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json(err))
})

router.get('/getHouses', (_,res) => {
    House.find()
        .then(houses => res.status(200).json(houses))
        .catch(err => res.status(500).json(err))
})

module.exports = router