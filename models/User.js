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
            enum: ['buyer', 'agent', 'provider', 'admin'],
            default: 'buyer'
        },
        name: String,
        lastName: String,
        secondLastName: String,
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
        files: Object,
        villaApproved: Boolean,
        priceApproved: Boolean,
        ssn: String,
        civilStatus: String,
        occupation: String,
        company: String,
        position: String,
        officePhone: String,
        kitchenCabinet: String,
        closetCabinet: String,
        floor: String,
        showerTile: String,
        agentNotified: Boolean,
        creditRequest: {
            type: Object,
            default: {}
        },
        step: {
            type: Number,
            default: 0
        },
        customerAgent: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        clients: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
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