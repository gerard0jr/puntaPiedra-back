let Schema = require('mongoose').Schema

let creditRequestSchema = new Schema(
    {
        active: {
            type: Boolean,
            default: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        workPhone: String,
        homePhone: String,
        rfc: String,
        cellPhone: String,
        livingTime: String,
        occupation: String,
        myAddress: String,
        companyName: String,
        companyField: String,
        companyAddress: String,
        companyTime: String,
        companyFunctions: String,
        companyCharge: String,
        companyRole: String,
        academicLevel: String,
        economicDependants: String,
        heigth: Number,
        weight: Number,
        imssNumber: String,
        carBrand: String,
        carValue: String,
        realStateNumber: String,
        realStateValue: Number,
        reference1Name: String,
        reference1Address: String,
        reference1Phone: String,
        reference2Name: String,
        reference2Address: String,
        reference2Phone: String,
        reference3Name: String,
        reference3Address: String,
        reference3Phone: String
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        },
        versionKey: false
    }
)

module.exports = require('mongoose').model('CreditRequest', creditRequestSchema)