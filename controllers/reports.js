const Report = require('../models/report');
const {validateRep} = require('./patients')

module.exports.getReportsByStatus = async (req, res) => {

    const {error} = validateRep(req.params);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        let status = req.params.status.toUpperCase();
        const reports = await Report.find({status}, "-updatedAt")
                                    .populate('doctor patient', 'name phoneNumber -_id')
        
        if(reports.length === 0) return res.status(200).json('No records found!');

        return res.status(200).json({
            status,
            reports
        })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}