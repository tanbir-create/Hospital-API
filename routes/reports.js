const router = require('express').Router();
const auth = require('../middlewares/auth')
const {getReportsByStatus} = require('../controllers/reports')

router.get('/:status', auth, getReportsByStatus);
module.exports = router;