const router = require("express").Router();
const { body } = require("express-validator");

const postCtrl = require("../Controllers/post");
const authMiddleware = require("../middlewares/check-auth");

router.post('/create', 
[
    authMiddleware,
    body('title').notEmpty().withMessage("Post title should not be empty"),
], 
postCtrl.createPost);
router.post('/update/:postId', [authMiddleware], postCtrl.updatePost);
router.post('/delete/:postId', [authMiddleware], postCtrl.deletePost);
router.post('/show/:postId?', [authMiddleware], postCtrl.showPost);

module.exports = router;
