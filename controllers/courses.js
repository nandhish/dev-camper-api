const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');


//@desc     Get courses
//@route    GET /api/v1/courses
//@route    GET /api/v1/bootcamps/:bootcampId/courses
//@access   Public
exports.getCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });

    } else {
        res.status(200).json(res.advancedResults);
    }
})

//@desc     Get single course
//@route    GET /api/v1/courses
//@route    GET /api/v1/courses/:id
//@access   Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });


    if (!Course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }


    res.status(200).json({
        success: true,
        // count: courses.length,
        data: course
    });
})


//@desc     Add course
//@route    POST /api/v1/courses
//@route    GET /api/v1/courses/:id
//@access   Public
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId).populate({
        path: 'bootcamp',
        strictPopulate: false,
        select: 'name description'
    });


    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`), 404);
    }
    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(
            `User ${req.params.id} is not authorized to add course to bootcamp ${bootcamp.id}`
            , 401));
    }
    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        // count: courses.length,
        data: course
    });
})


//@desc     Update course
//@route    PUT /api/v1/courses/:id
//@access   Public
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);


    if (!course) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`), 404);
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        // count: courses.length,
        data: course
    });
})


//@desc     Delete course
//@route    DELETE /api/v1/courses/:id
//@access   Public
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }

    await course.deleteOne();

    res.status(200).json({
        success: true,
        // count: courses.length,
        data: {}
    });
})
