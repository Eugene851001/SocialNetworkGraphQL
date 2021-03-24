import React, {Component} from 'react'
import {likePost, unlikePost, deletePost} from './apiPost'
import {Redirect} from 'react-router-dom'
import client from '../wsClient'
import Cookies from 'js-cookie'

class Post extends Component {

  constructor(props) {
	console.log(props);
    super();

	const {postId, author, myPost, description, date, image, likes, like} = props.post;
	this.state = {
	  postId: postId,
	  authorName: author.name,
	  myPost: myPost,
	  description: description,
	  date: date,
	  photo: image,
	  likes: likes,
	  like: like,
	  redirect: false,
	  redirectToLogination: false,
	}
	
	this.onLike = this.onLike.bind(this);
	this.onUnlike = this.onUnlike.bind(this);
	this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
	this.unsubscribe = client.subscribe(
        {
	      query: 'subscription { postUpdated {likes, postId} }',
		},
		{
		  next: (notification) => {
			  if (!notification?.data?.postUpdated) {
				  return;
			  }

			  const {likes, postId} = notification.data.postUpdated;
			  if (this.state.postId == postId) {
				this.setState({likes: likes});
			  }
			},
		  error: (err) => console.log(`Error: ${JSON.stringify(err, ["message", "arguments", "type", "name"])}`),
		  complete: (data) => console.log(`Completed: ${data}`),
		}, 
	  );
  }

  componentWillUnmount() {
    this.unsubscribe();
//	this.unsubscribeDelete();
  }

  onLike(e) {
    e.preventDefault();
	
	if (this.state.like) {
	  return;
	}
	
	likePost(this.state.postId)
	  .then(response => {
		console.log(response);
		if (response.errors) {
		  this.setState({redirectToLogination: true})
		  return
		}

	    this.setState({
		  likes: response.data.like.likes,
		  like: response.data.like.like,
		});
	  });
  }

  onUnlike(e) {
    e.preventDefault();

	if (!this.state.like) {
		return;
	}

	unlikePost(this.state.postId)
	  .then(response => {
		  if (response.errors) {
		    this.setState({redirectToLogination: true});
			return;
		  }

		  this.setState({
			  likes: response.data.unlike.likes,
			  like: response.data.unlike.like
		  })
	  });
  }

  onDelete(e) {
    e.preventDefault();
    
    deletePost(this.state.postId);
  }
  
  render() {
	let {authorName, description, date, likes, photo, myPost} = this.state;
	const buttonLike = <button className="button-like" onClick={this.onLike}>Likes {likes}</button>;
	const buttonUnlike = <button className="button-unlike" onClick={this.onUnlike}>Likes {likes}</button>;
	const buttonDelete = <button onClick={this.onDelete}>Удалить</button>;
	const body = <div className="post">
					<p><h3>{authorName}</h3></p>
					<p>{description}</p>
					<p>{date}</p>
					<img className ="post-image" src={photo} width="480" height="320" />
					<p>
						{this.state.like ? buttonUnlike : buttonLike}
						{myPost ? buttonDelete : ''}
					</p>
				</div>;
    return (
      <div>
		  {this.state.redirectToLogination ? <Redirect to="/Logination"/> : ''}
		  {this.state.redirect ? '' : body}
	  </div>
    );
  }
  
}

export default Post;