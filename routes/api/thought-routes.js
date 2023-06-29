const router = require('express').Router();
const { Thought } = require('../../models');
const { onSuccess, onError } = require('../../utils/handlers');

// GET all thoughts
router.get('/', async (req, res, next) => {
    try {
        onSuccess(res, await Thought.find({}), 'Thoughts found successfully!');
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
});

// GET a single thought by its _id
router.get('/:id', async (req, res, next) => {
    try {
        const thought = await Thought.findById(req.params.id);
        if (!thought) return onError(res, { message: 'No thought found with this id!' }, 404);
        onSuccess(res, thought, 'Thought found successfully!');
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
});

// Create a new thought
router.post('/', async (req, res, next) => {
    try {
        onSuccess(res, await Thought.create(req.body), 'Thought created successfully!', 201);
    } catch (err) {
        err.statusCode = 400;
        next(err);
    }
});

// Update a thought by its _id
router.put('/:id', async (req, res, next) => {
    try {
        onSuccess(res, await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }), 'Thought updated successfully!');
    } catch (err) {
        err.statusCode = 400;
        next(err);
    }
});

// DELETE a thought by its _id
router.delete('/:id', async (req, res, next) => {
    try {
        onSuccess(res, await Thought.findByIdAndDelete(req.params.id), 'Thought deleted successfully!');
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
});

// POST to create a reaction stored in a single thought's reactions array field
router.post('/:thoughtId/reactions', async (req, res, next) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) return onError(res, { message: 'No thought found with this id!' }, 404);
        thought.reactions.push(req.body);
        onSuccess(res, await thought.save(), 'Reaction created successfully!', 201);
    } catch (err) {
        err.statusCode = 400;
        next(err);
    }
});

// DELETE to pull and remove a reaction by the reaction's reactionId value
router.delete('/:thoughtId/reactions/:reactionId', async (req, res, next) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) return onError(res, { message: 'No thought found with this id!' }, 404);
        thought.reactions.pull(req.params.reactionId);
        onSuccess(res, await thought.save(), 'Reaction deleted successfully!');
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
});

module.exports = router;
