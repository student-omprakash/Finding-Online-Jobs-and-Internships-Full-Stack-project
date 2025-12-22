const express = require('express');
const router = express.Router();
const {
    getMyProfile,
    createOrUpdateProfile,
    uploadResume,
    uploadFile
} = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/me', protect, getMyProfile);
router.post('/', protect, createOrUpdateProfile);
router.post('/resume', protect, upload.single('resume'), uploadResume);
router.post('/upload-file', protect, upload.single('file'), uploadFile);

module.exports = router;
