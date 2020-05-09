import React from 'react'
import {Row, Col} from 'antd';

import "../stylesheets/navbar.css"

/*Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> 
from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/


export default function Navbar() {
    return (
        <nav id="navbar" class="navbar navbar-expand-lg bg-dark navbar-dark justify-content-between">
          <div id="navbar-logo-container">
             <img id="navbar-logo" src={require('../images/thinking.svg')} alt="Logo"/>
             <span id="navbar-title">PIX2PIX</span>
          </div>
          <div>
            <a class="navbar-brand" id="navbar-about" href="#">
              <span>ABOUT</span>
            </a>
             <a class="navbar-brand" id="navbar-create" href="#">
               <span>CREATE</span>
            </a>
          </div>
        </nav> 
    )
}
