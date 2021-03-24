const NOT_READY = 'Not ready';
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signout = (request, response) => {
  console.log('Signed out');
 //response.clearCookie('token');
  response.json();
}

exports.postSignup = (request, response) => {
  console.log(request.body);
  User.findOne({login: request.body.login}, function(err, user) {
      if (err) {
	    console.log(err);
		response.status(500).json({err: 'Error'});
		return;
	  }
	  
	  if (user) {
	    response.status(401).json({err: 'Please, choose another login'});
		return;
	  }
	  
	  user = new User(request.body);
      user.save(function(err){
      if (err) {
	    console.log(err);
	    response.status(500).json({err: 'Can not registrate'});
	  } else {
	    authorize(response, user)
	  }
    }); 
  });
}

exports.postSignin = (request, response) => {
  let {login, password} = request.body;
  User.findOne({login, password}, function(err, user){
    if (err || !user) {
	  console.log('User not found');
	  response.status(404).json({err: 'User not found'});
	} else {
	  authorize(response, user)
	}
  });
}

function authorize(response, user) {
	let token = jwt.sign({userId: user._id}, process.env.JWT_KEY);
	let maxAge = 60 * 10
	response.setHeader('Set-Cookie', `token=${token}; max-age=${maxAge}; HttpOnly`);
    response.status(200).json({
	  user: user,
	});
}

exports.requireSignin = (request, response, next) => {
  if (request.cookies.userId) {
    next();
  } else {
    response.status(401).json({err: 'Please, log in'});
  }
}

exports.isSignedIn = (request) => {
  return request.cookies.userId;
}

exports.getSignError = () => {return {err: 'Please, log in'}};