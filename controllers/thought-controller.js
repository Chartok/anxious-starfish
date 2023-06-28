const { Thought, User } = require('../models');
const HTTP_STATUS = require('../constants/httpStatus');

// centralized error handling
const handleError = (err, next) => {
    console.error(err);
    next(err);
};

const thoughtController = {
    async getThoughts(req, res, next) {
        try {
            const thoughts = await Thought.find().sort({ createdAt: -1 });
            res.json(thoughts);
        } catch (err) {
            handleError(err, next);
        }
    },

    async getSingleThought(req, res, next) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });
            if (!thought) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'No thought with this id!' });
            }
            res.json(thought);
        } catch (err) {
            handleError(err, next);
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
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Thought created but no user with this id!' });
            }
            res.json({ message: 'Thought successfully created!' });
        } catch (err) {
            handleError(err, next);
        }
    },

    async updateThought(req, res, next) {
        try {
            const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true });
            if (!thought) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'No thought with this id!' });
            }
            res.json(thought);
        } catch (err) {
            handleError(err, next);
        }
    },

    async deleteThought(req, res, next) {
        try {
            const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });
            if (!thought) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'No thought with this id!' });
            }
            const user = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );
            if (!user) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Thought deleted but no user with this id!' });
            }
            res.json({ message: 'Thought successfully deleted!' });
        } catch (err) {
            handleError(err, next);
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
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'No thought with this id!' });
            }
            res.json(thought);
        } catch (err) {
            handleError(err, next);
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
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'No thought with this id!' });
            }
            res.json(thought);
        } catch (err) {
            handleError(err, next);
        }
    },
};

module.exports = thoughtController;
