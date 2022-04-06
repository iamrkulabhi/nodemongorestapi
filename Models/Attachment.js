const Schema = require('mongoose').Schema;

const attachmentSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    path: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    size: {
        type: Number,
        require: true
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = require('mongoose').model('Attachment', attachmentSchema);

