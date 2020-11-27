const router = require('express').Router()
const User = require('../models/User')
const House = require('../models/House')
let jwt = require('jsonwebtoken')
let fs = require('fs-extra')
let multer = require('multer')

let storage = multer.diskStorage({
    destination: (req, _, cb) => {
        let path = `uploads/${req.params.email}`
        fs.mkdirsSync(path)
        cb(null, path)
    },
    filename: (_, file, cb) => cb(null, file.originalname)
})

let upload = multer({storage}).single('file')

router.post('/creditRequest', (req,res) => {
    let { id, ...fields } = req.body
    if(id){
        jwt.verify(id, process.env.JWT, (err, decoded) => {
            if(err) return res.status(401).json({message: 'Token inválido'})
            let { id } = decoded
            User.findById(id)
                .then(user => {
                    User.findByIdAndUpdate(id, {$set: {creditRequest: {...user.creditRequest, ...fields._doc}}}, {new: true})
                        .then(updatedUser => res.status(201).json(updatedUser))
                        .catch(err => res.status(501).json(err))
                })
                .catch(err => res.status(404).json(err))
        })
    }
})

router.post('/uploadFile/:email', upload, (req, res) => {
    let { email } = req.params
    let { name } = req.body
    let { filename } = req.file
    User.findOne({email})
        .then(user => {
            User.findOneAndUpdate({email}, {$set: {files: {...user.files, [name]: filename}}}, {new: true})
                .then(updatedUser => res.status(201).json(updatedUser))
                .catch(err => res.status(404).json(err))
        })
        .catch(err => res.status(501).json(err))
})

router.post('/getFile/:email', upload, (req, res) => {
    let { email } = req.params
    let { name } = req.body
    fs.readFile(`uploads/${email}/${name}`)
        .then(file => res.status(200).send(file))
        .catch(err => res.status(404).json(err))
})

router.post('/deleteFile/:email', upload, (req, res) => {
    let { email } = req.params
    let { name } = req.body
    User.findOne({email})
        .then(user => {
            let { files } = user
            let key = Object.keys(files).filter(key => files[key] === name ? key : false)
            User.findOneAndUpdate({email}, {$set: {files: {...user.files, [key]: false}}}, {new: true})
                .then(updatedUser => {
                    fs.unlink(`uploads/${email}/${name}`, errFile => {
                        if(errFile) return res.status(500).json(errFile)
                        res.status(200).json(updatedUser)
                    })
                })
                .catch(err => res.status(404).json(err))
        })
        .catch(err => res.status(404).json(err))
})

router.post('/getData', (req,res,next) => {
    const { id } = req.body
    if(id){
        jwt.verify(id, process.env.JWT, (err, decoded) => {
            if(err) return res.status(401).json({message: 'Token inválido'})
            let { id } = decoded
            User.findById(id)
                .then(user => {
                    // let {
                    //     active, 
                    //     verified, 
                    //     allowNewsletter, 
                    //     createdAt, 
                    //     updatedAt, 
                    //     resetPasswordExpires, 
                    //     resetPasswordToken,
                    //     ...filteredUser
                    // } = user 
                    res.status(200).json(user)
                })
                .catch(err => res.status(500).json(err))
        })
    } else res.status(404).json({message: 'No hay token'})
})

router.post('/getHouse', (req,res,next) => {
    const { id, lotId } = req.body
    if(id){
        jwt.verify(id, process.env.JWT, (err, decoded) => {
            if(err) return res.status(401).json({message: 'Token inválido'})
            House.findOne({lotId})
                .then(house => res.status(200).json(house))
                .catch(err => res.status(500).json(err))
        })
    } else res.status(404).json({message: 'No hay token'})
})

router.get('/getUsers', (_,res) => {
    User.find()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(404).json(err))
})

router.post('/getClientData', (req,res) => {
    const { selectedUser } = req.body
    User.findById(selectedUser)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json(err))
})

router.post('/updateClient', (req,res,next) => {
    const { id, data } = req.body
    User.findByIdAndUpdate(id, {$set:data}, {new: true})
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).json(err))
  })

module.exports = router