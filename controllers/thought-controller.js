const { Thought, User } = require('../models');
const { onSuccess, onError } = require('../utils/handlers');
const HTTP_STATUS = require('../constants/httpStatus');

const thoughtController = {
    async getThoughts(req, res, next) {
        try {
            const thoughts = await Thought.find().sort({ createdAt: -1 });
            onSuccess(res, thoughts);
        } catch (err) {
            onError(err, req, res, next);
        }
    },

    async getSingleThought(req, res, next) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });
            if (!thought) {
                const error = new Error('No thought found with this id!');
                error.statusCode = HTTP_STATUS.NOT_FOUND;
                throw error;
            }
            onSuccess(res, thought);
        } catch (err) {
            onError(err, req, res, next);
        }
    },

    async createThought(req, res, next) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );
            if (!user) {
                const error = new Error('Thought created but no user found with this id!');
                error.statusCode = HTTP_STATUS.NOT_FOUND;
                throw error;
            }
            onSuccess(res, null, 'Thought created successfully!', HTTP_STATUS.CREATED);
        } catch (err) {
            onError(err, req, res, next);
        }
    },

    async updateThought(req, res, next) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!thought) {
                const error = new Error('No thought found with this id!');
                error.statusCode = HTTP_STATUS.NOT_FOUND;
                throw error;
            }
            onSuccess(res, thought, 'Thought updated successfully!');
        } catch (err) {
            onError(err, req, res, next);
        }
    },

    async deleteThought(req, res, next) {
        try {
            const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });
            if (!thought) {
                const error = new Error('No thought found with this id!');
                error.statusCode = HTTP_STATUS.NOT_FOUND;
                throw error;
            }
            const user = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );
            if (!user) {
                const error = new Error('Thought deleted but no user found with this id!');
                error.statusCode = HTTP_STATUS.NOT_FOUND;
                throw error;
            }
            onSuccess(res, null, 'Thought deleted successfully!');
        } catch (err) {
            onError(err, req, res, next);
        }
    },

    async addReaction(req, res, next) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );
            if (!thought) {
                const error = new Error('No thought found with this id!');
                error.statusCode = HTTP_STATUS.NOT_FOUND;
                throw error;
            }
            onSuccess(res, thought, 'Reaction created successfully!', HTTP_STATUS.CREATED);
        } catch (err) {
            onError(err, req, res, next);
        }
    },

    async removeReaction(req, res, next) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );
            if (!thought) {
                const error = new Error('No thought found with this id!');
                error.statusCode = HTTP_STATUS.NOT_FOUND;
                throw error;
            }
            onSuccess(res, thought, 'Reaction deleted successfully!');
        } catch (err) {
            onError(err, req, res, next);
        }
    },
};

module.exports = thoughtController;
