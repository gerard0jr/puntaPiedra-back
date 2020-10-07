let Schema = require('mongoose').Schema
let plm = require('passport-local-mongoose')

let userSchema = new Schema(
    {
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
        userType: {
            type: String,
            enum: ['buyer', 'seller', 'agent', 'provider'],
            default: 'buyer'
        },
        name: String,
        lastName: String,
        secondLastName: String,
        company: String,
        phone: String,
        beneficiaryName: String,
        beneficiaryLastName: String,
        beneficiarySecondLastName: String,
        beneficiaryEmail: String,
        beneficiaryPhone: String,
        agent: {
            type: Schema.Types.ObjectId,
            ref: 'User'
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