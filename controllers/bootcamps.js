const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');


//@desc     Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    // const bootcamps = await Bootcamp.find(req.query);
    //const bootcamps = queryStr;// await Bootcamp.find();
    res.status(200).json(res.advancedResults);
    // res.status(200).json({ success: true, msg: 'Show all bootcamps' });

});

//@desc     Get bootcamp
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    res.status(200).json({
        success: true,
        data: bootcamp
    })

});

//@desc     Create new bootcamp
//@route    POST /api/v1/bootcamps/:id
//@access   Public
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    // Add user to req, body
    req.body.user = req.user.id;

    // Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    // If the user is not an admin, they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 401));
    }
    console.log(req.body);
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    })

});
//@desc     Update  bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   Public
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    let bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401));
    }

    bootcamp = await Bootcamp.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: bootcamp
    });
    //res.status(201).json({ success: true, msg: 'Create a botocamp' });

});

//@desc     Delete  bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Public
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        res.status(400).json({
            success: false
        })
    }
    res.status(200).json({
        success: true,
        data: {}
    })

});

//@desc     Upload photo for bootcamp
//@route    PUT /api/v1/bootcamps/:id/photo
//@access   Public
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    // console.log(req.body);
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        res.status(400).json({
            success: false
        })
    }

    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to upload the photo in this bootcamp`, 401));
    }


    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 404));
    }

    //console.log(Object.keys(req.files).length);
    const file = req.files.file;
    //console.log(file);
    //Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse('Please upload an image file', 400));
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    //Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    console.log(file.name);

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    });

    res.status(200).json({
        success: true,
        data: file.name
    })

});