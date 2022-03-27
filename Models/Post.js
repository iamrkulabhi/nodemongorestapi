const Schema = require("mongoose").Schema;

const postSchema = new Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const postModel = require("mongoose").model('Post', postSchema);

module.exports = postModel;

