const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const verifyToken = require('../middlewares/verifyToken');


// Route: POST /auth/signup
router.get('/info',verifyToken, profileController.getUserInfo);

module.exports = router;
