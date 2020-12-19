const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeature = require('../utils/apiFeature');

exports.getAll = Model => catchAsync(async (req, res, next) => {
    const features = new APIFeature(Model.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // const posts = await features.query.explain();
    const doc = await features.query;

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: doc.length,
        data: {
            data: doc
        }
    });
});

exports.getOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    if (req.file) req.body.image = req.file.filename

    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            doc
        }
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    if (req.file) req.body.image = req.file.filename

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});