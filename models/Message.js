let Schema = require('mongoose').Schema

let messageSchema = new Schema(
    {
        active: {
            type: Boolean,
            default: true
        },
        question: String,
        answers: Array,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        agent: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        },
        versionKey: false
    }
)

module.exports = require('mongoose').model('Message', messageSchema)