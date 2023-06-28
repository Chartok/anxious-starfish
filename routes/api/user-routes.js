const router = require('express').Router();
const { User } = require('../../models');

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
        console.log('Users found successfully!');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single user by its _id and populated thought and friend data
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
        if (!user) return res.status(404).json({ message: 'No user found with this id!' });
        res.json(user);
        console.log('User found successfully!');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new user
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        const user = await newUser.save();
        res.status(201).json(user);
        console.log('User created successfully!');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a user by its _id
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(user);
        console.log('User updated successfully!');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a user by its _id
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.json(user);
        console.log('User deleted successfully!');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { $addToSet: { friends: req.params.friendId } }, { new: true});

        if (!user) return res.status(404).json({ message: 'No user found with this id!' });
        res.json(user);
        console.log('Friend added successfully!');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { $pull: { friends: req.params.friendId } }, { new: true});

        if (!user) return res.status(404).json({ message: 'No user found with this id!' });
        res.json(user);
        console.log('Friend removed successfully!');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
