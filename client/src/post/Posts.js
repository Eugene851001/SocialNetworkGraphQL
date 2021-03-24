import React, {Component} from 'react'
import Post from './Post'
import Nav from '../Nav'
import Header from '../Header'
import Footer from '../Footer'
import {getPosts, createPost} from './apiPost'
import {Redirect} from 'react-router-dom'
import client from '../wsClient'


class Posts extends Component {

    constructor() {
        super();
		
        this.state = {
            posts: [],
			redirect: false,
        }
		
		this.onSubmit = this.onSubmit.bind(this);
		this.onChangeFile = this.onChangeFile.bind(this);
		this.onChangeText = this.onChangeText.bind(this);
		this.changeState = this.changeState.bind(this);
		this.onPostCreated = this.onPostCreated.bind(this);
		this.posts = []
    }
	
	onSubmit(e) {
	  e.preventDefault();
	  createPost(this.postData)
	    .then(response => {
		  console.log(response);
		  if (response.errors) {
            this.setState({redirect: true});   
			return;
		  }

		//  this.setState({posts: response.data.posts});
		});
	}
	
	onChangeFile(e) {
	  	this.postData.set('filedata', e.target.files[0]);
	}
	
	onChangeText(e) {
	  this.postData.set('description', e.target.value);
	}

	changeState() {
		this.setState({posts: this.state.posts});
	}

	onPostCreated(notification) {
		console.log(notification);
		this.state.posts.unshift(notification.data.postCreated);
		console.log(this.state.posts);
		this.setState((state) => {
			return {posts: state.posts}
		});
		this.render();
	}

    componentDidMount() {

		this.unsubscribePostCreated = client.subscribe(
			{
			  query: `subscription { 
				  postCreated {
					description, 
					image, 
					author {
					  name
					},
					likes,
					like,
					date,
					postId,
					myPost
				  } 
				}`,
			},
			{
			  next: (notification) => {
				console.log(notification);
				this.setState((state) => {
					state.posts.unshift(notification.data.postCreated);
					return {posts: state.posts}
				});
			  },
			  error: (err) => console.log(`Error: ${JSON.stringify(err, ["message", "arguments", "type", "name"])}`),
			  complete: (data) => console.log(`Completed: ${data}`),
			}, 
		  );	 

	  this.unsubscribePostDeleted = client.subscribe(
		  {
		    query: `subscription {
				  postDeleted
			  }`
		  },
		  {
		    next: (notification) => {
				console.log(`Post delete: ${JSON.stringify(notification)}`);
				let postId = notification.data.postDeleted;
				console.log(postId);
				console.log(this.state.posts);
				let postIndex = -1;
				for (let i = 0; i < this.state.posts.length; i++) {
					if (this.state.posts[i].postId == postId) {
						postIndex = i;
					}
				}
				
				console.log(postIndex);
				if (postIndex != -1) {
					console.log(`Post deleted ${postIndex}`);
					this.setState((state) => {
						state.posts.splice(postIndex, 1)
						return {posts: state.posts}
					});
				}
			},
		    error: (err) => console.log(`Error: ${JSON.stringify(err, ["message", "arguments", "type", "name"])}`),
		    complete: (data) => console.log(`Completed: ${data}`),
		  }
	  )

	  this.postData = new FormData();
      getPosts().then(response => {
            console.log(response);
            if (!response) {
                console.log('Can not get response');
                return;
            }

			if (response.errors) {
				this.setState({redirect: true});
				return;
			} 
            
			console.log(response.data.posts);
            this.setState({posts: response.data.posts});
        })
    }

	componentWillUnmount() {
		this.unsubscribePostCreated();
	//	this.unsubscribePostDeleted();
	}

    render(){
      return (
        <div className="grid-container">
			{this.state.redirect ? <Redirect to="/Logination"/> : ''}
			<Header title={{name: "Посты"}}/>
			<Nav/>
			<article>
				<form action="create" encType="multipart/form-data" className="add-post-form">
					<input type="text" name="description" onChange={this.onChangeText}/><br/>
					<input type="file" name="filedata" onChange={this.onChangeFile} required/><br/>
					<input type="submit" value="Добавить" onClick={this.onSubmit}/>
				</form>
				{this.state.posts.map((post) => {return <div><Post post={post} key={post.postId}/></div>})}
			</article>
			<Footer />
        </div>
      );    
    }
}

export default Posts;