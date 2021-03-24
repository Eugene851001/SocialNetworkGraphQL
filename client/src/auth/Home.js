import React from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import {signout} from './apiAuth'

function Home() {
  signout();
  return (
    <div>
      <Header title={{name: "Главная"}}/>
      <article>
        <div className="main-menu">
          <Link to='/Registration'>Регистрация</Link><br/>
          <Link to='/Logination'>Вход</Link>
        </div>
      </article>
      <Footer/>
	  </div>
  );
}

export default Home;