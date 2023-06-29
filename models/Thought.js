const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ReactionSchema = require('./Reaction');
const dateFormat = require('../utils/date-format');

const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // Use a getter method to format the timestamp on query
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    username: {
        type: String,
        required: true
    },
    // Use ReactionsSchema to validate data for a reaction
    reactions: [ReactionSchema]
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    // Prevent virtuals from creating duplicate of _id as `id`
    id: false
});

// Create a virtual called reactionCount that retrieves the length of the thought's reactions array field on query.
ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
}
);

// Export the Thought model with the ThoughtSchema
module.exports = mongoose.model('Thought', ThoughtSchema);

