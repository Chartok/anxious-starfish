const router = require('express').Router();
const { User, Thought } = require('../../models');
const { onSuccess, onError } = require('../../utils/handlers');

// GET all users
router.get('/', async (req, res, next) => {
    try {
        onSuccess(res, await User.find({}), 'Users found successfully!');
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
});

// GET a single user by its _id and populated thought and friend data
router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
        if (!user) return onError(res, { message: 'No user found with this id!' }, 404);
        onSuccess(res, user, 'User found successfully!');
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
});

// Create a new user
router.post('/', async (req, res, next) => {
    try {
        onSuccess(res, await User.create(req.body), 'User created successfully!', 201);
    } catch (err) {
        err.statusCode = 400;
        next(err);
    }
});

// Update a user by its _id
router.put('/:id', async (req, res, next) => {
    try {
        onSuccess(res, await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }), 'User updated successfully!');
    } catch (err) {
        err.statusCode = 400;
        next(err);
    }
});

// DELETE a user by its _id
router.delete('/:id', async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        await Thought.deleteMany({ username: user.username });
        onSuccess(res, user, 'User deleted successfully!');
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
});

// POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { $addToSet: { friends: req.params.friendId } }, { new: true });
        if (!user) return onError(res, { message: 'No user found with this id!' }, 404);
        onSuccess(res, user, 'Friend added successfully!');
    } catch (err) {
        err.statusCode = 400;
        next(err);
    }
});

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { $pull: { friends: req.params.friendId } }, { new: true });
        if (!user) return onError(res, { message: 'No user found with this id!' }, 404);
        onSuccess(res, user, 'Friend removed successfully!');
    } catch (err) {
        err.statusCode = 400;
        next(err);
    }
});

module.exports = router;
