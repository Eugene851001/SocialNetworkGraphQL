const express = require('express');
const post = require('../controllers/post');
const {requireSignin} = require('../controllers/auth');

const postRouter = express.Router();

postRouter.post('/create', requireSignin, post.createPost);

postRouter.get('/posts', requireSignin, post.showPosts);

postRouter.put('/like', requireSignin, post.like);

postRouter.put('/unlike', requireSignin, post.unlike);

postRouter.delete('/:postId/delete', requireSignin, post.delete);

module.exports = postRouter;