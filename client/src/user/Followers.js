import React, {Component} from 'react'
import {getFollowers} from './apiUser'
import User from './User'
import Nav from '../Nav'
import Header from '../Header'
import Footer from '../Footer'

class Users extends Component {
  	
  constructor() {
    super();
	this.state = {
	  users: []
	}
  }	  
  
  
  componentDidMount() {
    this.state.userId = this.props.match.params.userId;
    getFollowers(this.state.userId)
	  .then(response => {
		console.log(response);
	    this.setState({users: response.data.followers});
	  })
  }
  
  render() {
	return (
      <div className="grid-container">
	    <Header title={{name: "Подписчики"}}/>
	    <Nav/>
	    <article>
			{this.state.users.map((user) => {return <User user={user}/>})}
		</article>
		<Footer/>
	  </div>
    );
  }
}

export default Users