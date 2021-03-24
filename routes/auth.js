const express = require('express');
const auth = require('../controllers/auth');

const authRouter = express.Router();

authRouter.get('/signin', function(request, response){
  auth.getSignin(request, response);
});

authRouter.post('/signin', function(request, response){
  console.log(request.body);
  auth.postSignin(request, response);
});

authRouter.put('/signout', function(request, response){
  auth.signout(request, response);
});

authRouter.post('/signup', function(request, response){
  console.log(request.body);
  auth.postSignup(request, response);
})


module.exports = authRouter;