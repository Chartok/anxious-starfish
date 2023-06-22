const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dateFormat = require('../utils/dateFormat');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true, 
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

// Create friend count virtual
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

// Create the User model using the UserSchema
const User = mongoose.model('User', UserSchema);

// Export the User model
module.exports = User;
