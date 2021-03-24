import React from 'react'
import {Link} from 'react-router-dom'

function Nav() {
  return (
    <nav>
	  <h2><Link to="/Profile/me">Профиль</Link></h2>
	  <h2><Link to="/Users">Пользователи</Link></h2>
	  <h2><Link to="/Posts">Посты</Link></h2>
	  <h2><Link to="/">Выйти</Link></h2>
	</nav>
  );
}

export default Nav;