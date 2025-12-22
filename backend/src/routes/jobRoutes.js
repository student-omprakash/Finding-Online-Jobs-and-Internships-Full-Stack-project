const express = require('express');
const router = express.Router();
const {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getJobs)
    .post(protect, authorize('recruiter', 'admin'), createJob);

router.get('/recommendations', protect, require('../controllers/jobController').getRecommendedJobs);

router.route('/:id')
    .get(getJobById)
    .put(protect, authorize('recruiter', 'admin'), updateJob)
    .delete(protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
