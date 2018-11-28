import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './Home.scss';
import logo from '../assets/logo.png'

class Home extends Component {

  createNewNotebook() {
    //console.log('Home.createNewNotebook()');
    this.props.history.push('/notebooks/new');
  }

  render() {
    return (
      <div className="app-container home">

        <header>
          <h2>Home</h2>
        </header>

        <div className="content">
          <img className="logo" src={logo} alt="notes@ Logo" width="180" height="40" />
          <p>
            <b>notes<span className="at-char">@</span></b> allows you to connect an idea with a place.
            Create a new note and it will be tagged with the location where the note was created.
            The location will be stored as geolocation coordinates and can be associated with a place on Google Maps.
            You can organized notes into notebooks which can be viewed as a list or as points on a map.
          </p>
          <p>To get started create a new notebook now.</p>
          <button className="create-notebook" onClick={this.createNewNotebook.bind(this)}>Create a New Notebook</button>
      </div>

      <div className="navigation">
        <Link to="/notebooks">Go to Notebooks</Link>
      </div>

    </div>
    );
  }
}

export default Home;