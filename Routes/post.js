const router = require("express").Router();
const { body, param } = require("express-validator");
const mongoose = require("mongoose");

const postCtrl = require("../Controllers/post");
const authMiddleware = require("../middlewares/check-auth");
const PostModel = require('../Models/Post');

router.post('/create', 
[
    authMiddleware,
    body('title').notEmpty().withMessage("Post title should not be empty"),
], 
postCtrl.createPost);
router.post('/update/:postId', 
[
    authMiddleware,
    param('postId')
    .custom((value, {req}) => {
        if(!mongoose.Types.ObjectId.isValid(value)){
            throw new Error("Invalid postId found!");
        }
        if(value && mongoose.Types.ObjectId.isValid(value)){
            return PostModel.findById(value).populate("createdBy", "email").then(post => {
                if(!post){
                    return Promise.reject('no post found found!');
                }else{
                    if(req.user.email !== post.createdBy.email){
                        return Promise.reject('Unauthorized to update post!')
                    }
                }
            })
        }
    })
], 
postCtrl.updatePost);
router.post('/delete/:postId', 
[
    authMiddleware,
    param('postId')
    .custom((value, {req}) => {
        if(!mongoose.Types.ObjectId.isValid(value)){
            throw new Error("Invalid postId found!");
        }
        if(value && mongoose.Types.ObjectId.isValid(value)){
            return PostModel.findById(value).populate("createdBy", "email").then(post => {
                if(!post){
                    return Promise.reject('no post found found!');
                }else{
                    if(req.user.email !== post.createdBy.email){
                        return Promise.reject('Unauthorized to delete post!')
                    }
                }
            })
        }
    })
], 
postCtrl.deletePost);
router.post('/show/:postId?', [authMiddleware], postCtrl.showPost);

module.exports = router;
