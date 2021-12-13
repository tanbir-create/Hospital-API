const router = require('express').Router();
const auth = require('../middlewares/auth')
const {register, createReport, getAllReports} = require('../controllers/patients')

router.post('/register', auth, register);
router.post('/:id/create_report', auth, createReport);
router.get('/:id/reports', auth, getAllReports);

module.exports = router;