const {Patient, validate} = require('../models/patient');
const Report = require('../models/report')
const _ = require('lodash');
const Joi = require('joi');
const ObjectId = require('mongoose').Types.ObjectId;


module.exports.register = async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    try {
        let patient = await Patient.findOne({ phoneNumber: req.body.phoneNumber });
    
        if(patient) return res.status(200).json({
            message: 'Patient already registered',
            patient
        });

        patient = new Patient( _.pick(req.body, ['name', 'phoneNumber']) );
        await patient.save();
        return res.status(201).json(patient);

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server error' });
    }
}

module.exports.createReport = async (req, res) => {
    const {error} = validateReport(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
   
    try {

        if(!ObjectId.isValid(req.params.id)) return res.status(404).json('Patient not found');

        
        const patient = await Patient.findById(req.params.id);

        if(!patient) return res.status(404).json({message: 'Patient not found'});

        const report = new Report(
            {
                doctor: req.user._id,
                patient: patient._id,
                status: (req.body.status).toUpperCase()
            }

        )

        patient.reports.push(report._id);

        await patient.save();
        await report.save();

        return res.status(201).json(report);

   } catch (error) {
        return res.status(500).json(error);
   }

}

validateReport = function(input) {
    const schema = Joi.object({
        status: Joi.string().valid('Negative', 'Travelled-Quarantine', 'Symptoms-Quarantine', 'Positive-Admit').insensitive()
    })

    return schema.validate(input);
}


module.exports.getAllReports = async (req, res) => {
    if(!ObjectId.isValid(req.params.id)) return res.status(404).json({ message: 'Patient not found' });


    try{
        const patient = await Patient.findById(req.params.id);
        if(!patient) return res.status(404).json({ message: 'Patient not found' });

        const reports = await Report.find({patient: req.params.id}, "-updatedAt")
                                    .select('-patient')
                                    .sort('createdAt')
                                    .populate('doctor', 'name -_id')
        // if(!reports) return res.status(404).json('Patient not found');
        return res.status(200).json({
            Patient: {
                Name: patient.name,
                Contact: patient.phoneNumber
            },
            reports
        })

        
        

    } catch(error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports.validateRep =  validateReport;