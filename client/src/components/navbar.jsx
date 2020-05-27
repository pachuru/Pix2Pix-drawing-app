import React from 'react'

import '../stylesheets/navbar.css'

/* Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>
from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a> */


/**
 * The Navbar component returns the navbar of the web app
 * @component
 */
function Navbar () {
  return (
    <nav id="navbar" className="navbar navbar-expand-lg bg-dark navbar-dark justify-content-between">
      <div id="navbar-logo-container">
        <img id="navbar-logo" src={require('../images/thinking.svg')} alt="Logo"/>
        <span id="navbar-title">PIX2PIX</span>
      </div>
      <div id="navbar-buttons-wrapper">
        <button id="navbar-about" href="#">
          <span>ABOUT</span>
        </button>
        <button id="navbar-create" href="#">
          <span>CREATE</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
