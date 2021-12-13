const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken')

const doctorSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        maxlength: 100
    },

    email: {
         type: String,
         required: true,
         unique: true,
         maxlength: 255
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    }

}, {
    timestamps: true
});

doctorSchema.methods.generateAuthToken = function() { 
    const token = jwt.sign({ _id: this._id}, process.env.JWT_SECRET, { expiresIn: '2d' });
    return token;
}



function validateDoctor(doctor) {
    const schema = Joi.object({
        name: Joi.string().max(100).required(),
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.any().equal(Joi.ref('password')).required()
                    .messages({ 'any.only': "Passwords don't match" }),
    })
    // .with('password', 'confirmPassword')

    return schema.validate(doctor)
}

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = {
    Doctor,
    validate: validateDoctor
}
