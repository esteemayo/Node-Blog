const User = require('../models/User');
const factory = require('../controllers/handlerFactory');

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: `This route is not defined! Please use ${req.protocol}://${req.get('host')}/users/register instead`
    });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.createOne(User);
exports.deleteUser = factory.deleteOne(User);