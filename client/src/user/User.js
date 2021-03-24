import React from 'react'
import {Link} from 'react-router-dom'

function User(props) {
  return (
    <div>
	  <img src={props.user.photo} width="32" height="32"/>
	  <Link to={"/Profile/" + props.user.userId}>{props.user.name}</Link>
	</div>
  );
}

export default User;