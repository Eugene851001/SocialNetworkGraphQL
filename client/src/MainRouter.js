import React from 'react'
import {BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from './auth/Home'
import Logination from './auth/Logination'
import Registration from './auth/Registration'
import Posts from './post/Posts'
import NotFound from './NotFound'
import Profile from './user/Profile'
import Users from './user/Users'
import Following from './user/Following'
import Followers from './user/Followers'

function MainRouter() {
  return (
    <BrowserRouter>
	  <Switch>
	    <Route exact path="/" component={Home}/>
		<Route exact path="/Logination" component={Logination}/>
		<Route exact path="/Registration" component={Registration}/>
		<Route exact path="/Posts" component={Posts}/>
		<Route exact path="/Profile/:userId" component={Profile}/>
		<Route exact path="/Users" component={Users}/>
		<Route exact path="/Following/:userId" component={Following}/>
		<Route exact path="/Followers/:userId" component={Followers}/>
		<Route component={NotFound}/>
	  </Switch>
	</BrowserRouter>
  );
}

export default MainRouter;