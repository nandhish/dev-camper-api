const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');


//@desc     Get all user 
//@route    GET /api/v1/users
//@access   Public/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

//@desc     Get single user 
//@route    GET /api/v1/users/:id
//@access   Public/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

//@desc     Create user
//@route    POST /api/v1/users
//@access   Public/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });
});

//@desc     Update user
//@route    PUT /api/v1/user
//@access   Public/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(201).json({
        success: true,
        data: user
    });
});

//@desc     Delete user
//@route    PUT /api/v1/users:/id
//@access   Public/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(201).json({
        success: true,
        data: {}
    });
});

