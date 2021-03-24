import React, {Component} from 'react'
import {signin} from './apiAuth'
import {Redirect} from 'react-router-dom'
import Header from '../Header'
import Nav from '../Nav'
import Footer from '../Footer'

class Logination extends Component {
  
  constructor() {
    super();
	this.onSubmit = this.onSubmit.bind(this);
	this.handleChangeLogin = this.handleChangeLogin.bind(this);
	this.handleChangePassword = this.handleChangePassword.bind(this);
	this.state = {
	  err: '',
	  login: '',
	  password: '',
	  signedIn: false
	};
  }

  onSubmit = (e) => {
    e.preventDefault();
	let {login, password} = this.state;
	let user = {login, password};
	console.log(user);
	signin(user)
	  .then(res => {
		if (res === undefined) {
		  console.log('No response');
		  return;
		}
	    if (res.err) {
		  this.setState({err: res.err});
		} else {
		  console.log(res); 
		  this.setState({signedIn: true, userId: res.user._id});
		}
	  });
  }

  handleChangeLogin(e) {
    this.setState({login: e.target.value});
  }	  
  
  handleChangePassword(e) {
    this.setState({password: e.target.value});
  }
	
  render(){
	
	return(
		<div>
			<Header title={{name: "Вход"}}/>
			<article>
				<h2>{this.state.err}</h2>
				<h2>{this.state.signedIn ? <Redirect to={"/Profile/" + this.state.userId}/> : ''}</h2>
				<form action="signin" method="POST" className="logination-form">
					<label>Логин</label>
					<input name="login" type="text" value={this.state.login} 
						required onChange={this.handleChangeLogin}/><br></br>
					<label>Пароль</label>
					<input name="password" type="password" value={this.state.password}
						required onChange={this.handleChangePassword}/><br></br>
					<input type="submit" value="Вход" onClick={this.onSubmit}/>
				</form>
			</article>
		<Footer />
		</div>
	);
  }
}

export default Logination;