const PostModel =  require("../Models/Post");
const vh = require("./validation-handlers");

const createPostHandler = (req, res, next) => {

    vh.handleValidation(req);

    const _title = req.body.title;
    const _desc = req.body.description;
    const _status = req.body.status ? req.body.status : 'inactive';
    const _user = req.user;
    const _attachments = req.body.attachments;

    const post = new PostModel({
        title: _title,
        description: _desc,
        status: _status,
        createdBy: _user,
        attachments: _attachments
    });

    post.save().then(post => {
        res.status(201).json({success: true, data: post});
    }).catch(err => {
        next(err);
    });
};

const updatePostHandler = (req, res, next) => {
    vh.handleValidation(req);
    const _postId = req.params.postId;

    PostModel.updateOne({_id: _postId}, req.body).then(post => {
        res.status(200).json({success: true, data: post});
    }).catch(err => {
        next(err);
    });
};

const deletePostHandler = (req, res, next) => {
    vh.handleValidation(req);
    const _postId = req.params.postId;
    
    PostModel.deleteOne({_id: _postId}).then(post => {
        res.status(200).json({success: true, data: post});
    }).catch(err => {
        next(err);
    });
};

const showPostHandler = (req, res, next) => {
    vh.handleValidation(req);
    const _postId = req.params.postId;

    if(_postId){
        PostModel.findById(_postId)
        .populate("createdBy", "username email")
        .populate("attachments")
        .then(posts => {
            res.status(200).json({success: true, data: posts});
        }).catch(err => next(err));
    }else{
        PostModel.find({})
        .populate("createdBy", "username email")
        .populate("attachments")
        .then(posts => {
            res.status(200).json({success: true, data: posts});
        }).catch(err => next(err));
    }
};

module.exports = {
    createPost: createPostHandler,
    updatePost: updatePostHandler,
    deletePost: deletePostHandler,
    showPost: showPostHandler
};

