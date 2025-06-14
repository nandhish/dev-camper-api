const express = require('express');
const { getBootcamps, createBootcamp, getBootcamp, updateBootcamp, deleteBootcamp, bootcampPhotoUpload } = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

//Include other resource routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

//router.route('/').get(getBootcamps).post(createBootcamp);

router.route('/')
.get(advancedResults(Bootcamp, 'courses'), getBootcamps)
.post(protect, authorize('publisher', 'admin'), createBootcamp);


router.route('/:id')
.get(protect, authorize('publisher', 'admin'),  getBootcamp)
.put(protect, authorize('publisher', 'admin'),  updateBootcamp)
.delete(protect, authorize('publisher', 'admin'),  deleteBootcamp);

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;