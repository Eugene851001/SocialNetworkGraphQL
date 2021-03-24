import React from 'react'

function Header(props) {
  return (
	<header>
		<h2>{props.title.name}</h2>
	</header>
  );
}

export default Header;