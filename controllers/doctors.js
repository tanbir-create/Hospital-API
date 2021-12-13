const {Doctor, validate} = require('../models/doctor');
const _ = require('lodash')
const Joi = require('joi');
const bcrypt = require('bcrypt')


module.exports.signup = async (req, res) => {
    
    const {error} = validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

   try {
    
        let doctor = await Doctor.findOne({ email: req.body.email });
        if(doctor) return res.status(400).json({
            message: 'Doctor already registered'
        });

        doctor = new Doctor(_.pick(req.body, ['name', 'email', 'password']));

        const salt = await bcrypt.genSalt(10);
        doctor.password = await bcrypt.hash(doctor.password, salt);

        await doctor.save();

        return res.status(201).json( _.pick(doctor, ['name', 'email']));
   } catch (error) {
       return res.status(500).json({ message: 'Internal server error' });
   }

}

module.exports.login = async (req, res) => {

    const { error } = validateLoginBody(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});

    try {
        let doctor = await Doctor.findOne({ email: req.body.email }).select('+password');
        if(!doctor) return res.status(400).json({ message: 'Invalid email or password' });
       
        const validPassword = await bcrypt.compare(req.body.password, doctor.password);
        if(!validPassword) return res.status(400).json({ message: 'Invalid email or password' });
       
        const token = doctor.generateAuthToken();   
        res.status(200).json({ token });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

}

function validateLoginBody(body) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().required() 
    })

    return schema.validate(body);
}