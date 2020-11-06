let Schema = require('mongoose').Schema

let houseSchema = new Schema(
    {
        available: {
            type: Boolean,
            default: true
        },
        lotId: Number,
        block: Number,
        lotNumber: Number,
        lotSize: Number,
        villa: String,
        price: Number,
        englishDescription: String,
        españolDescription: String,
        bedrooms: Number,
        bathrooms: Number,
        cars: Number,
        images: Array,
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        },
        versionKey: false
    }
)

module.exports = require('mongoose').model('House', houseSchema)