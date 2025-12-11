const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const verifyToken = require('../middlewares/verifyToken');


// Route: GET /user/info - Get user information
router.get('/info', verifyToken, profileController.getUserInfo);

// Route: PUT /user/profile - Update username and/or email
router.put('/profile', verifyToken, profileController.updateProfile);

// Route: PUT /user/password - Change password
router.put('/password', verifyToken, profileController.updatePassword);

// Route: PUT /user/picture - Update profile picture
router.put('/picture', verifyToken, profileController.updateProfilePicture);

module.exports = router;
