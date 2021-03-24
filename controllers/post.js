const NOT_READY = 'Not ready';
const NEED_LOG_IN = 'You need to log in';

const Post = require('../models/post');
const User = require('../models/user');

exports.createPost = function(request, postData) {
  return new Promise(function(resolve, reject) {
	let date = new Date();

	let userId = request.cookies.userId;
	
	let post = new Post({
	  date: date,
	  description: postData.description, 
	  author: userId, 
	  image: postData.image
	});

	User.findById(userId, function(err, user) {
      if (err || !user) {
		  console.log(err);
		  reject(err);
		  return;
	  }

      post.save(function(err, post) {
		if (err) {
		  console.log(err);
		  reject(err);
		  return;
		}
  
		let postToSend = {
		  postId: post._id,
		  author: user,
		  myPost: post.author._id == request.cookies.userId,
		  description: post.description,
		  date: post.date.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' }),
		  image: 'uploads/' + post.image,
		  likes: post.likes.length,
		  like: post.likes.indexOf(request.cookies.userId) != -1
		};
		resolve(postToSend);
	  });
	});
  })

}

exports.delete = function(request, userData) {
  return new Promise(function(resolve, reject) {
	let postId = userData.postId;
  
	if (!request.cookies || !request.cookies.userId) {
	  reject({err: NEED_LOG_IN});
	  return;
	}
  
	console.log(postId);
	Post.findOne({_id: postId})
	  .populate('author')
	  .exec(function(err, post){
		if (err) {
			console.log(err);
			reject(err);
			return;
		}
  
		if (!post) {
			console.log('Can not find post');
			reject({err: 'Post not found'});
			return;
		}
		
		console.log(post.author);
		if (post.author._id != request.cookies.userId) {
		  console.log(`${post.author._id}-${request.cookies.userId}`);
		  reject({err: 'This is not your post'});
		  return;
		}
  
		Post.deleteOne({_id: postId}, function(err, result) {
			if (err) {
				console.log(err);
				reject(err);
				return;
			}
  
			console.log(result);
		    resolve(postId);
		})
	})
  })
}

exports.like = function(request, userData) {
  return new Promise(function(resolve, reject) {
	console.log('Try to set like');
	if (request.cookies === undefined || request.cookies.userId === undefined) {
	  console.log(NEED_LOG_IN);
	  reject(NEED_LOG_IN);
	  return;
	}
	
	let postId = userData.postId;
	Post.findOne({_id: postId}, function(err, post){
	  if (err || !post) {
		console.log('Post not found');
		reject({err: 'Post not found'});
		return;
	  }
	  
	  for (let i = 0; i < post.likes.length; i++) {
		if (post.likes[i] == request.cookies.userId) {
		  console.log('Already liked');
		  reject({err: 'You already liked'});
		  return;
		}		  
	  }
	  
	  post.likes.push(request.cookies.userId);
	  console.log(post.likes.length);
	  Post.findOneAndUpdate({_id: postId}, {likes: post.likes}, {new: true}, function(err, post){
		if (err) {
		  console.log(err);
		} else {
		  console.log(post);
		}

		let userId = request.cookies.userId;
		let postToSend = {
			postId: post._id,
			authorName: post.authorName,
			description: post.description,
			date: post.date,
			photo: "uploads/" + post.image,
			likes: post.likes.length,
			like: post.likes.indexOf(userId) != -1  
		  };
		resolve(postToSend);
	  });
	});
  })

}

exports.unlike = function(request, userData) {

  return new Promise(function(resolve, reject) {
	if (request.cookies === undefined || request.cookies.userId === undefined) {
		reject({err: NEED_LOG_IN});
		return;
	}

	let postId = userData.postId;
	
	Post.findById(postId, function(err, post){
		if (err) {
			console.log(err);
			reject(err);
			return;
		}
 
        if (post.likes.indexOf(request.cookies.userId) === -1) {
          reject({err: 'You did not liked this post'});
		  return;
		}       
		
		let likes = post.likes;
		likes.splice(likes.indexOf(request.cookies.userId), 1);
		Post.findOneAndUpdate({_id: postId}, {likes: likes}, {new: true}, function(err, post){
			if (err) {
				console.log(err);
				reject(err);
				return;
			}

			let userId = request.cookies.userId;
			let postToSend = {
				postId: post._id,
				authorName: post.authorName,
				description: post.description,
				date: post.date,
				photo: "uploads/" + post.image,
				likes: post.likes.length,
				like: post.likes.indexOf(userId) != -1  
			  };
			resolve(postToSend);
		})
	});
  })

}

function showPosts(request, response) {
  return new Promise(function(resolve, reject) {
	console.log('Try to get posts');
	if (!request.cookies?.userId) {
	  reject(NEED_LOG_IN);
	  return;
	}
	
	User.findById(request.cookies.userId, function(err, user){
	  if (err) {
		console.log(err);
		reject('Error');
		return;
	  }
	  
	  user.following.push(request.cookies.userId);
	  Post.find({author: { $in: user.following}}).
		populate('author').
		sort({date: -1}).
		exec(function(err, posts){
		  if (err) {
			console.log(err);
			response.status(500).json({err: 'Error'});
		  } else {
			let postsToSend = posts.map( post => {
				return {
					postId: post._id,
					author: post.author,
					myPost: post.author._id == request.cookies.userId,
					description: post.description,
					date: post.date.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' }),
					image: 'uploads/' + post.image,
					likes: post.likes.length,
					like: post.likes.indexOf(request.cookies.userId) != -1
				  }
			})
			resolve(postsToSend);
		  }
		});
	});  
  })
}

exports.showPosts = function(request, response) {
  return showPosts(request, response);
}