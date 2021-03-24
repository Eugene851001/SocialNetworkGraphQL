const post = require("../controllers/post");
const user = require("../controllers/user");
const {UPDATE_POST, CREATE_POST, DELETE_POST} = require('./constants');
const { PubSub } = require('graphql-subscriptions');
const {isSignedIn, getSignError } = require('../controllers/auth');

const pubsub = new PubSub()

module.exports = {

    user(args, request) {
        console.log(args.id)
        return user.getUser(request, args.id)
    },

    posts(args, request) {
        if (!isSignedIn(request)) {
            Promise.reject(getSignError());
        }

        return post.showPosts(request)
    },

    users() {
        let users =  user.showUsers()
        return users
    },

    followers(args, request) {
        if (!isSignedIn(request)) {
            Promise.reject(getSignError());
        }

        return user.getFollowers(request, args);
    },

    following(args, request) {
        if (!isSignedIn(request)) {
            Promise.reject(getSignError());
        }
        
        return user.getFollowing(request, args);
    },   

    createPost(args, request) {
        if (!isSignedIn(request)) {
            Promise.reject(getSignError());
        }

        let result  = post.createPost(request, args);
        pubsub.publish(CREATE_POST, {postCreated: result});
        return result;
    },

    deletePost(args, request) {
        let postId = post.delete(request, args);
        pubsub.publish(DELETE_POST, {postDeleted: postId});

        return postId;
    },

    editPhoto(args, request) {
        if (!isSignedIn(request)) {
            Promise.reject(getSignError());
        }

        return user.editPhoto(request, args);
    },

    like(args, request) {
        if (!isSignedIn(request)) {
            console.log('Sign error');
            Promise.reject(getSignError());
        }

        let newPost = post.like(request, args);
        pubsub.publish(UPDATE_POST, {postUpdated: newPost});
        return newPost; 
    },

    unlike(args, request) {
        if (!isSignedIn(request)) {
            Promise.reject(getSignError());
        }

        let newPost = post.unlike(request, args);
        pubsub.publish(UPDATE_POST, {postUpdated: newPost});
        return newPost;
    },

    follow(args, request) {
        return user.addFollower(request, args).then(() => {user.addFollowing(request, args)});
    },

    unfollow(args, request) {
        user.removeFollower(request, args).then(() => {user.removeFollowing(request, args)});
    },
    
    subscription: {
        postUpdated: () => pubsub.asyncIterator(UPDATE_POST),
        postCreated: () => pubsub.asyncIterator(CREATE_POST),
        postDeleted: () => pubsub.asyncIterator(DELETE_POST)
    },
}