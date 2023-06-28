const { User, Thought } = require('../models');
const HTTP_STATUS = require('../constants/httpStatus');

// centralized error handling
const handleError = (err, next) => {
    console.error(err);
    next(err);
};

const userController = {
    async getUsers(req, res, next) {
        try {
            const users = await User.find().select('-__v');
            res.json(users);
        } catch (err) {
            handleError(err, next);
        }
    },

    async getSingleUser(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .select('-__v')
                .populate('friends')
                .populate('thoughts');
            if (!user) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'No user with this id!' });
            }
            res.json(user);
        } catch (err) {
            handleError(err, next);
        }
    },

    async createUser(req, res, next) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            handleError(err, next);
        }
    },

    async updateUser(req, res, next) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!user) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'No user with this id!' });
            }
            res.json(user);
        } catch (err) {
            handleError(err, next);
        }
    },

    async deleteUser(req, res, next) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });
            if (!user) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'No user with this id!' });
            }
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'User and associated thoughts deleted!' });
        } catch (err) {
            handleError(err, next);
        }
    },

    async addFriend(req, res, next) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { new: true }
            );
            if (!user) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'No user with this id!' });
            }
            res.json(user);
        } catch (err) {
            handleError(err, next);
        }
    },

    async removeFriend(req, res, next) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            );
            if (!user) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'No user with this id!' });
            }
            res.json(user);
        } catch (err) {
            handleError(err, next);
        }
    },
};

module.exports = userController;
