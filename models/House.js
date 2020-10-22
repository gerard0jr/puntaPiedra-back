let Schema = require('mongoose').Schema

let houseSchema = new Schema(
    {
        name: String,
        lotNumber: String,
        active: {
            type: Boolean,
            default: true
        },
        lotSize: Number,
        price: Number,
        available: {
            type: Boolean,
            default: true
        },
        englishDescription: String,
        españolDescription: String,
        bedrooms: Number,
        bathrooms: Number,
        cars: Number,
        mainImage: String,
        otherImages: Array
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