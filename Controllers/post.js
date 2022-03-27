const PostModel =  require("../Models/Post");
const vh = require("./validation-handlers");

const createPostHandler = (req, res, next) => {

    vh.handleValidation(req);

    const _title = req.body.title;
    const _desc = req.body.description;
    const _status = req.body.status ? req.body.status : 'inactive';
    const _user = req.user;

    const post = new PostModel({
        title: _title,
        description: _desc,
        status: _status,
        createdBy: _user
    });

    post.save().then(post => {
        res.status(201).json({success: true, data: post});
    }).catch(err => {
        next(err);
    });
};

const updatePostHandler = (req, res, next) => {

};

const deletePostHandler = (req, res, next) => {

};

const showPostHandler = (req, res, next) => {
    const _postId = req.params.postId;

    if(_postId){
        PostModel.findById(_postId).populate("createdBy", "username email").then(posts => {
            res.status(200).json({success: true, data: posts});
        }).catch(err => next(err));
    }else{
        PostModel.find({}).populate("createdBy", "username email").then(posts => {
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

