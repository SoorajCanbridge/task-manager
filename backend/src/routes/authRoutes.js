const express = require('express');
const authController = require('../controllers/authController');
const { registerRules, loginRules, validate } = require('../utils/validators');

const router = express.Router();

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);

module.exports = router;
