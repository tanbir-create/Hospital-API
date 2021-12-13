const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({

    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },

    status: {
        type: String,
        required: true,
        uppercase: true,
        enum: ['NEGATIVE', 'TRAVELLED-QUARANTINE', 'SYMPTOMS-QUARANTINE', 'POSITIVE-ADMIT']
    }

}, {
    timestamps: true
});


const Report = new mongoose.model('Report', reportSchema);
module.exports = Report