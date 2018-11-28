import React, { Component } from 'react';
import './PlacesDialog.scss'

class PlacesDialog extends Component {

  placeSelect(place) {
    //console.log(`PlacesDialog.placeSelect() id: ${place.id} `);
    this.props.select(place);
  }

  blockClick(e) {
    //console.log(`PlacesDialog.blockClick()`);
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    return (
      <div className="modal-mask places-dialog" onClick={this.props.close}>

        <div className="modal-wrapper">

          <div className="modal-container" onClick={this.blockClick}>

            <div className="modal-header">
              <h3>Nearby Places</h3>
            </div>

            <div className="modal-body places-dialog" onClick={e => e.preventDefault()}>
              <input type="text" placeholder="Enter a place name" value={this.props.placeName} onChange={this.props.onChange}/>
              <ul className="place-list">
                {
                  this.props.places.length > 0 && this.props.places.map(place => (
                    <li className="place" key={place.id} onClick={this.placeSelect.bind(this, place)}>
                      <img src={place.icon} alt="place icon" width="25" height="25"/>
                      <span className="place-name">{place.name}</span>
                    </li>
                  ))
                }
              </ul>
              {
                (!this.props.places || this.props.places.length === 0) &&
                <span>No places found at your current location.</span>
              }
            </div>

            <div className="modal-footer">
              {this.props.showMore &&
                <button className="modal-optional-botton" onClick={this.props.more}>
                  More Results
                </button>
              }
              <button className="modal-default-button" onClick={this.props.close}>
                Cancel
              </button>
            </div>

          </div>

        </div>

      </div>
    )
  }

}

export default PlacesDialog;