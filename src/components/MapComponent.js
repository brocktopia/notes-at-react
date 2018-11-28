import React, { Component } from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'
import { LaunchIcon } from "../assets/SVGIcons";
import './MapComponent.scss'
import { MAP } from 'react-google-maps/lib/constants';

// Base class is wrapped in react-google-maps HOC

class MapBaseComponent extends Component {

  map;

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    //console.log(`MapComponent.componentDidMount()`);
    this.map = this.myRef.current.context[MAP];
    if (this.props.register) {
      this.props.register(this.map);
    }
  }

  componentDidUpdate(prevProps) {
    //console.log(`MapComponent.componentDidUpdate()`);
    this.map.setCenter(this.props.center);
  }

  render() {
    const position = new window.google.maps.LatLng(this.props.center.lat, this.props.center.lng);
    return (
      <GoogleMap
        defaultZoom={this.props.zoom || 8}
        defaultCenter={ position }
        ref={this.myRef}
      >
        {this.props.markers && this.props.markers.map((marker, index) =>
          <Marker
            position={marker.position}
            key={index}
            onClick={marker.onMarkerClick}
          />)
        }
        {this.props.marker &&
          <Marker
            position={this.props.marker.position}
            onClick={this.props.marker.onMarkerClick}
            draggable={this.props.editable}
            onDragEnd={this.props.markerDrop}
          ></Marker>
        }
        {this.props.showInfo &&
          <InfoBox defaultPosition={ position }>
            <div className="note-info">
              <h3>{this.props.data.name}</h3>
              <div>{this.props.data.date}</div>
              {this.props.data.place &&
              <div>
                <img className="place-icon" alt="place icon" src={this.props.data.place.icon}/>
                <span>{this.props.data.place.name}</span>
                <a href={this.props.data.place.url} rel="noopener noreferrer" target="_blank">
                  <LaunchIcon title="Goto Place" className="tiny-icon"/>
                </a>
              </div>
              }
              <p style={{maxWidth:'250px'}}>{this.props.data.note}</p>
              {this.props.data.onShowNote &&
              <button onClick={this.props.data.onShowNote}>Open Note</button>
              }
            </div>
          </InfoBox>
        }
      </GoogleMap>
    )
  }

}

const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';

// utility method for default configs and to isolate API Key
function mapProps(config = {}) {
  return Object.assign({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&v=3.exp&libraries=places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div className="map-component" style={{ height: `100%` }} />,
  }, config)
}

const Map = withScriptjs(withGoogleMap(MapBaseComponent));

export const MapComponent = props => {
  const mapConfig = mapProps(props);
  return (
    <Map {...mapConfig} />
  )
};