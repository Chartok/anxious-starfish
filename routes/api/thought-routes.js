const router = require('express').Router();
const { Thought } = require('../../models');

// GET all thoughts
router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find({});
        res.json(thoughts);
        console.log('Thoughts found successfully!');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single thought by its _id
router.get('/:id', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);
        if (!thought) return res.status(404).json({ message: 'No thought found with this id!' });
        res.json(thought);
        console.log('Thought found successfully!');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new thought
router.post('/', async (req, res) => {
    try {
        const newThought = await Thought.create(req.body);
        const thought = await newThought.save();
        res.status(201).json(thought);
        console.log('Thought created successfully!');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a thought by its _id
router.put('/:id', async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(thought);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a thought by its _id
router.delete('/:id', async (req, res) => {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.id);
        res.json(thought);
        console.log('Thought deleted successfully!');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST to create a reaction stored in a single thought's reactions array field
router.post('/:thoughtId/reactions', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) return res.status(404).json({ message: 'No thought found with this id!' });
        thought.reactions.push(req.body);
        const updatedThought = await thought.save();
        res.status(201).json(updatedThought);
        console.log('Reaction created successfully!');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE to pull and remove a reaction by the reaction's reactionId value
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) return res.status(404).json({ message: 'No thought found with this id!' });
        thought.reactions.pull(req.params.reactionId);
        const updatedThought = await thought.save();
        res.json(updatedThought);
        console.log('Reaction deleted successfully!');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
