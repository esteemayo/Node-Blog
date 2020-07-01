const _ = require('lodash');
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
    let doc = req.body

    if (req.file)
        doc.image = req.file.filename
    else
        image = 'noimage.jpg';

    doc = await Model.create(doc);

    res.status(201).json({
        status: 'success',
        data: {
            doc
        }
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    let doc = req.body

    if (req.file)
        doc.image = req.file.filename
    else
        image = 'noimage.jpg';

    doc = await Model.findByIdAndUpdate(req.params.id, doc, {
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