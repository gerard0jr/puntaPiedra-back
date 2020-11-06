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
        language: String,
        country: String,
        state: String,
        birthDate: Date,
        lotId: Number,
        block: Number, 
        additionalLotId: Number,
        additionalBlock: Number, 
        economicProfile: String,
        wantFinance: Boolean,
        step: {
            type: Number,
            default: 0
        },
        agent: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        allowNewsletter: {
            type: Boolean,
            default: false
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