const User = require('../models/user');
const mongoose = require('mongoose');

const NEED_LOG_IN = 'You need to log in';


exports.editPhoto = function(request, userData) {
  return new Promise(function(resolve, reject) {
	let userId = request.cookies.userId;
	User.updateOne({_id: userId}, {photo: userData.filename}, function(err, result){
	  if (err) {
		console.log(err);
	  } else {
		console.log(result);
		resolve('../uploads/' + userData.filename);
	  }
	}); 
  })
}

exports.getUser = function(request, id) {
  return new Promise(function(resolve, reject) {
	console.log('Getting user');
	let userId = id;
	if (userId === 'me') {
		userId = request.cookies.userId;
	}

	User.findById(userId)
	  .exec(function(err, user){
		if (err) {
		  console.log(err);
		  reject({err: 'Error'});
		  return;
		}
	  
		if (!user) {
		  reject({err: 'Can not find user'});
		  return;
		}
	  
		if (request.cookies === undefined && request.cookies.userId === undefined) {
		  reject({err: NEED_LOG_IN });
		  return;
		}
	  
		let signed = user.followers.indexOf(mongoose.Types.ObjectId(request.cookies.userId)) != -1;
		console.log(signed);
		let myProfile = request.cookies.userId === userId;
		resolve( {
		  myProfile: myProfile,
		  signed: signed,
		  photo: '../uploads/' + user.photo,
		  name: user.name,
		  userId: userId
		});
	});
  })
}

exports.showUsers = function(request, response) {
  return new Promise(function(resolve, reject) {
    User.find({}, function(err, users){
		if (err) {
		  console.log(err);
		  reject({err: 'Error'});
		  return;
		}
	
		let usersToSend = users.map((user) => {
		  return {
			name: user.name,
			photo: "uploads/" + user.photo,
			userId: user._id		
		  }
		});
	
		resolve(usersToSend); 
	  });
  })
}

exports.getFollowing = function(request, userData) {
	return new Promise(function(resolve, reject) {
		let userId = userData.userId;  
		if (userId == 'me') {
		  userId = request.cookies.userId;
		}
	  
		console.log('Try get followers');
		User.findById(userId, function(err, user){
		  if (!user) {
			reject({err: 'User not found'});
			return;
		  }
	  
		  User.find({_id: { $in: user.following}}, function(err, users){
			let usersToSend = users.map((user) => {
			  return {
				name: user.name,
				photo: "../uploads/" + user.photo,
				userId: user._id
			  }
			});
			console.log(usersToSend);
			resolve(usersToSend);
		  });
		});
	  })
}

exports.getFollowers = function(request, userData) {
  return new Promise(function(resolve, reject) {
	let userId = userData.userId;  
	if (userId == 'me') {
	  userId = request.cookies.userId;
	}
  
	console.log('Try get followers');
	User.findById(userId, function(err, user){
	  if (!user) {
		reject({err: 'User not found'});
		return;
	  }
  
	  User.find({_id: { $in: user.followers}}, function(err, users){
		let usersToSend = users.map((user) => {
		  return {
			name: user.name,
			photo: "../uploads/" + user.photo,
			userId: user._id
		  }
		});
		console.log(usersToSend);
		resolve(usersToSend);
	  });
	});
  })
}

exports.addFollowing = function(request, userData) {

  let userId = userData.userId;
  
  return new Promise(function(resolve, reject) {
	User.findOne({_id: request.cookies.userId}, function(err, user){
		if (err) {
		  console.log(err);
		  reject(err);
		  return;
		}
		
		if (user.following.indexOf(mongoose.Types.ObjectId(userId)) != -1) {
		  reject({err: 'Already follow'});
		  return;
		}
		
		let following = user.following;
		console.log(userId);
		following.push(userId);
		User.findOneAndUpdate({_id: request.cookies.userId}, {following: following}, {new: true}, function(err, user){
		  if (err) {
			console.log(err);
			reject(err);
			return;
		  }
		  
		  resolve(true);
		});
	  });
  })
}

exports.removeFollowing = function(request, userData) {
  return new Promise(function(resolve, reject) {
	if (!request?.cookies.userId) {
		reject({err: NEED_LOG_IN});
		return;
	  }
	
	  let userId = userData.userId;
	  User.findByIdAndUpdate(request.cookies.userId, {$pull: {following: userId}}, {new: true})
		.exec(function(err, user){
		  resolve(true);
		});  
  })
}

exports.addFollower = function(request, userData) {
  return new Promise(function(resolve, reject) {
	if (!request?.cookies.userId) {
		reject({err: NEED_LOG_IN});
		return;
	  }
	  
	  let userId = userData.userId;
	  User.findByIdAndUpdate(userId, {$push: {followers: request.cookies.userId}})
		.exec(function(err, user){
		  if (err) {
			console.log(err);
			reject(err)
			return;
		  }
		  
		  resolve();
		});
   })
}

exports.removeFollower = function(request, userData) {
  return new Promise(function(resolve, reject) {
	if (!request?.cookies.userId) {
		reject(NEED_LOG_IN);
		return;
	  }
	  
	  let userId = userData.userId;
	  User.findByIdAndUpdate(userId, {$pull: {followers: request.cookies.userId}})
		.exec(function(err, user){
		  if (err) {
			console.log(err);
			reject(err);
			return;
		  }
		  
		  resolve();
		});
  })
}
