const uuid = require('uuid');
const sharp = require('sharp');
const multer = require('multer');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        return cb(null, true);
    }
    cb(new AppError('Not an image! Please upload only images', 400), false);
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.upload = upload.single('image');

exports.resize = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    const ext = req.file.mimetype.split('/')[1];

    req.file.filename = `${uuid.v4()}-${ext}`;

    await sharp(req.file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/posts/${req.file.filename}`);

    next();
});