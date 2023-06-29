const { User, Thought } = require('../models');
const { onSuccess, onError } = require('../utils/handlers');
const HTTP_STATUS = require('../constants/httpStatus');

const userController = {
    async getUsers(req, res, next) {
        try {
            const users = await User.find().select('-__v');
            onSuccess(res, users);
        } catch (err) {
            onError(err, req, res, next);
        }
    },

    async getSingleUser(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .select('-__v')
                .populate('friends')
                .populate('thoughts');
            if (!user) {
                const error = new Error('No user found with this id!');
                error.statusCode = HTTP_STATUS.NOT_FOUND;
                throw error;
            }
            onSuccess(res, user);
        } catch (err) {
            onError(err, req, res, next);
        }
    },

    async createUser(req, res, next) {
        try {
            const user = await User.create(req.body);
            onSuccess(res, user, 'User created successfully!', HTTP_STATUS.CREATED);
        } catch (err) {
            onError(err, req, res, next);
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
                const error = new Error('No user found with this id!');
                error.statusCode = HTTP_STATUS.NOT_FOUND;
                throw error;
            }
            onSuccess(res, user, 'User updated successfully!');
        } catch (err) {
            onError(err, req, res, next);
        }
    },

    async deleteUser(req, res, next) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });
            if (!user) {
                const error = new Error('No user found with this id!');
                error.statusCode = HTTP_STATUS.NOT_FOUND;
                throw error;
            }
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            onSuccess(res, null, 'User and associated thoughts deleted!');
        } catch (err) {
            onError(err, req, res, next);
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
                const error = new Error('No user found with this id!');
                error.statusCode = HTTP_STATUS.NOT_FOUND;
                throw error;
            }
            onSuccess(res, user, 'Friend added successfully!');
        } catch (err) {
            onError(err, req, res, next);
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
                const error = new Error('No user found with this id!');
                error.statusCode = HTTP_STATUS.NOT_FOUND;
                throw error;
            }
            onSuccess(res, user, 'Friend removed successfully!');
        } catch (err) {
            onError(err, req, res, next);
        }
    },
};

module.exports = userController;
