import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class NavError extends Component {

  componentDidMount() {
    //console.log(`NavError.componentDidMount() route: ${this.props.match.url}`);
  }

  render() {
    return (
      <div className="app-container" id="navError">

        <header>
          <h2>Page Not Found</h2>
        </header>

        <div className="content default">
          <p>The page you're looking for can not be found.</p>
          <p>Route <b className="error-text">{this.props.match.url}</b> does not compute.</p>
        </div>

        <div className="navigation">
          <Link to="/">Home</Link>
          &gt;
          <Link to="/notebooks">Notebooks</Link>
        </div>

      </div>
    );
  }
}

export default NavError;