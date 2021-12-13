const mongoose = require('mongoose');
const Joi = require('joi');

const patientSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        maxlength: 100
    },

    phoneNumber: {
        type: String,
        unique: true,
        required: true,
        minlength: 10,
        maxlength: 10,
        trim: true
    },

    reports: 
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Report'
        }]

}, {
    timestamps: true
})


function validatePatient(input) {
    const schema = Joi.object({
        name: Joi.string().max(100).required(),
        phoneNumber: Joi.string().min(10).max(10).required()     
    })

    return schema.validate(input);
}


const Patient = new mongoose.model('Patient', patientSchema);
module.exports = {
    Patient,
    validate: validatePatient
};
