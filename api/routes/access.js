const express = require('express');
const router = express.Router();
const accessController = require('../controllers/access');

router.post("/login", accessController.login);

router.post("/signup", accessController.signup);

module.exports = router