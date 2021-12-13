const router = require('express').Router();
const { signup, login } = require('../controllers/doctors')

router.post('/register', signup);
router.post('/login', login);

module.exports = router;