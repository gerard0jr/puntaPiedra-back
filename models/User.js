let Schema = require('mongoose').Schema
let plm = require('passport-local-mongoose')

let userSchema = new Schema(
    {
        name: String,
        middleName: String,
        lastName: String,
        mothersLastName: String,
        email: {
            type: String,
            unique: true,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        },
        verified: {
            type: Boolean,
            default: false
        },
        profilePicture: {
            type: String,
            default: '/node-assets/default-picture.png'
        },
        resetPasswordToken: Number,
        resetPasswordExpires: Number
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        },
        versionKey: false
    }
)

userSchema.plugin(plm, { usernameField: 'email' })
module.exports = require('mongoose').model('User', userSchema)