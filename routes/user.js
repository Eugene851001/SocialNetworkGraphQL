const express = require('express');
const user = require('../controllers/user');
const {requireSignin} = require('../controllers/auth');

const userRouter = express.Router();

userRouter.put('/editPhoto', requireSignin, user.editPhoto);

userRouter.get('/users', function(request, response){
  user.showUsers(request, response);
});

userRouter.put('/follow', requireSignin, user.addFollower, user.addFollowing);

userRouter.put('/unfollow', requireSignin, user.removeFollower, user.removeFollowing);

userRouter.get('/:userId/following', function(request, response){
  user.getFollowing(request, response);
});

userRouter.get('/:userId/followers', function(request, response){
  user.getFollowers(request, response);
});

userRouter.get('/:userId', requireSignin, user.getUser);

module.exports = userRouter;