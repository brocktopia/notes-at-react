import React, { Component } from 'react';
import { MapComponent } from '../components/MapComponent';
import moment from 'moment'
import './NoteEdit.scss'
import { CloseIcon, SaveIcon, ForwardIcon, BackIcon, LocationIcon, PlaceIcon, SearchIcon } from '../assets/SVGIcons'
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import ModalDialog from '../components/ModalDialog';
import PlacesDialog from '../components/PlacesDialog'

const NoteName = (props) => (
  <div className="name">
    <label htmlFor="noteName">Name</label>
    <input type="text" id="noteName" ref={props.setRef} value={props.name} maxLength="40" onChange={props.onChange} placeholder="Name for your note" tabIndex="1" />
      {props.name && props.isMobile ?
        <span className="input-info" style={{fontSize:'smaller'}}>
          Maximum 40 characters (<span className={props.name.length < 30 ? 'char-count' : 'char-count-close'}>{40 - props.name.length}</span> remaining)
        </span>
        :
        <span className="input-info">
          <span className="char-count">{props.name.length}</span> (40 character limit)
        </span>
      }
  </div>
);

const NoteDate = (props) => (
  <div className="date">{props.date ? moment(props.date).format('LLLL') : ''}</div>
);

const Geocords = (props) => (
  <div className="geocoords">
    <label htmlFor="geocords">Location:</label>
    {props.location && !props.locationDenied && <span id="geocords" className="link">{props.location.lat + ', ' + props.location.lng}</span>}
    {props.locationDenied && <span className="location-denied">Location access has been denied</span>}
    {!props.locationDenied && !props.location && <span className="location-unknown">Your location can not be determined</span>}
    <LocationIcon title="Lookup Location" className="icon-small" onClick={props.onLocate}/>
  </div>
);

const Place = (props) => (
  <div className="place">
    {props.hasPlace ?
      <span>
        <img src={props.place.icon} alt="place icon" className="icon-small" style={{verticalAlign:'text-bottom'}}/>
        {props.place.name}
      </span>
      :
      <span>
        <PlaceIcon className="icon-small" title="Find a Place"/>
        <span className="no-place">Click the button to add a place</span>
      </span>
    }
      {props.hasPlace ?
        <span style={{float:'right'}}>
          <button className="small" onClick={props.clear} style={{marginRight: '10px'}}>Remove</button>
          <button className="small" onClick={props.find} tabIndex="2">Change</button>
        </span>
        :
        <span style={{float:'right'}}>
          <button className="small" onClick={props.find} tabIndex="2">Lookup Places</button>
        </span>
      }
  </div>
);

const Search = (props) => (
  <div className="search">
    <input
      type="text"
      value={props.input}
      onChange={props.onChange}
      onKeyPress={(e) => {let key = e.keyCode || e.which || e.key; if (key === 13 && props.onSearch) props.onSearch()}}
      className="map-search-input"
      placeholder="Search of location"
      tabIndex="3"
    />
    <SearchIcon className="icon-small" title="Search" onClick={props.onSearch} />
    <span className="map-info">Drag marker to move location.</span>
  </div>
);

const NoteNote = (props) => (
  <div className="note-input">
    <textarea id="noteNote" ref={props.setRef} value={props.note} onChange={props.onChange} placeholder="Your note" tabIndex="4"></textarea>
  </div>
);

@inject('rootStore')
@observer
class NoteEdit extends Component {

  render() {
    return (

      <div>

        {this.uiStore.editorDevice === 'desktop' ?

          <div className="app-container edit desktop">
            <header>
              <h2>{this.mode === 'edit' ? 'Edit' : 'New'} Note</h2>
              <span className="button-bar">
                {this.canSave &&
                <button className="icon save-note" onClick={this.saveNote.bind(this)}><SaveIcon title="Save Note"/></button>
                }
                <button className="icon close-note" onClick={this.closeNoteEdit.bind(this)}><CloseIcon title="Cancel Note Edit" /></button>
              </span>
            </header>

            {this.state.note ? // need to wait until note data gets fetched

              <div className="content">
                <NoteName name={this.state.note.name} setRef={this.setNameRef.bind(this)} onChange={this.onNameChange.bind(this)}/>
                <NoteDate date={this.state.note.Created_date}/>
                <Geocords location={this.state.note.geocode} locationDenied={this.locationDenied}
                          onLocate={this.updateCoordinates.bind(this, true)}/>
                <Place place={this.state.note.place} hasPlace={!!this.state.note.place && !!this.state.note.place._id} find={this.findPlace.bind(this)}
                       clear={this.clearPlace.bind(this)}/>
                <Search
                  input={this.state.searchInput}
                  onChange={this.onSearchInputChange.bind(this)}
                  onSearch={this.onSearchPlace.bind(this)}
                />
                {this.state.note.geocode &&
                <MapComponent
                  center={this.state.note.geocode}
                  zoom={15}
                  marker={{position: this.state.note.geocode}}
                  editable={true}
                  markerDrop={this.onMapMarkerDrop.bind(this)}
                  register={this.registerMap.bind(this)}
                />
                }
                <NoteNote note={this.state.note.note} setRef={this.setNoteRef.bind(this)} onChange={this.onNoteChange.bind(this)}/>
              </div>

              :

              <div className="content"></div>

            }

            <div className="navigation">
              <a onClick={this.closeNoteEdit.bind(this)}>Cancel</a>
              <a className="action-link" onClick={this.saveNote.bind(this)}>Save</a>
            </div>
          </div>

          :

          <div className="mobile app-container">
            <header>
              <h2>Note - {this.mode === 'edit' ? 'Edit' : 'Create'}</h2>
              {this.mobilePage === 1 ?
                <span className="button-bar">
                  <button className="icon delete-notebook" onClick={this.nextPage.bind(this)}><ForwardIcon title="Next Page"/></button>
                  {this.canSave &&
                  <button className="icon save-note" onClick={this.saveNote.bind(this)}><SaveIcon title="Save Note"/></button>
                  }
                  <button className="icon close-note" onClick={this.closeNoteEdit.bind(this)}><CloseIcon title="Cancel Note Edit" /></button>
                </span>
                :
                <span className="button-bar">
                  <button className="icon delete-notebook" onClick={this.previousPage.bind(this)}><BackIcon title="Previous Page"/></button>
                  {this.canSave &&
                  <button className="icon save-note" onClick={this.saveNote.bind(this)}><SaveIcon title="Save Note"/></button>
                  }
                  <button className="icon close-note" onClick={this.closeNoteEdit.bind(this)}><CloseIcon title="Cancel Note Edit" /></button>
                </span>
              }
            </header>

            {this.state.note ? // need to wait until note data gets fetched
              <div>
                {this.mobilePage === 1 ?

                  <div className="content name-edit">
                    <NoteName name={this.state.note.name} isMobile={true} setRef={this.setNameRef.bind(this)} onChange={this.onNameChange.bind(this)}/>
                    <NoteDate date={this.state.note.Created_date}/>
                    <Geocords location={this.state.note.geocode} locationDenied={this.locationDenied}
                              onLocate={this.updateCoordinates.bind(this, true)}/>
                    <Place place={this.state.note.place} hasPlace={!!this.state.note.place && !!this.state.note.place._id} find={this.findPlace.bind(this)}
                           clear={this.clearPlace.bind(this)}/>
                    <Search
                      input={this.state.searchInput}
                      onChange={this.onSearchInputChange.bind(this)}
                      onSearch={this.onSearchPlace.bind(this)}
                    />
                    {this.state.note.geocode &&
                    <MapComponent
                      center={this.state.note.geocode}
                      zoom={15}
                      marker={{position: this.state.note.geocode}}
                      editable={true}
                      markerDrop={this.onMapMarkerDrop.bind(this)}
                      register={this.registerMap.bind(this)}
                    />
                    }
                  </div>

                  :

                  <div className="content">
                    <NoteNote note={this.state.note.note} setRef={this.setNoteRef.bind(this)} onChange={this.onNoteChange.bind(this)}/>
                  </div>

                }
              </div>
              :
              <div className="content name-edit"></div>
            }
            <div className="navigation">
              <a onClick={this.closeNoteEdit.bind(this)}>Cancel</a>
              { this.mobilePage === 1 ?
                <span className="button-bar">
                  {this.canSave &&
                  <a onClick={this.saveNote.bind(this)}>Save</a>
                  }
                  <a className="action-link" onClick={this.nextPage.bind(this)}>Next</a>
                </span>
                :
                <span className="button-bar">
                  {this.canSave &&
                  <a onClick={this.saveNote.bind(this)}>Save</a>
                  }
                  <a onClick={this.previousPage.bind(this)}>Previous</a>
                </span>
              }
            </div>

          </div>

        }

        {this.showMessage &&
        <ModalDialog
          header={this.messageTitle}
          body={this.messageBody}
          className={this.messageClass}
          onCancel={() => this.showMessage = false}
          onConfirm={this.modalConfirm.bind(this)}
        />
        }

        {this.showConfirmPlace &&
        <ModalDialog
          modalType="yesno"
          header={this.confirmPlaceTitle}
          body={this.confirmPlaceBody}
          onCancel={() => this.showConfirmPlace = false}
          onConfirm={this.confirmPlaceMethod}
        />
        }

        {this.showPlacesDialog &&
        <PlacesDialog
          places={this.places}
          placeName={this.lookupPlaceName}
          select={this.placeSelected.bind(this)}
          close={() => this.showPlacesDialog = false}
          showMore={this.showMoreButton}
          more={this.moreSelected.bind(this)}
          onChange={this.onPlaceNameChange.bind(this)}
        />
        }

        {this.noteStore.isLoading && <div className="loading-mask"><span>{this.loadingMessage}</span></div>}

      </div>
    );
  }

  @observable loadingMessage = 'Loading...';
  @observable mode;
  @observable locationDenied = false;
  @observable mobilePage = 1; // 1 | 2
  @observable messageTitle;
  @observable messageBody;
  @observable messageClass;
  @observable showMessage = false;
  @observable places = [];
  @observable lookupPlaceName = '';
  @observable showConfirmPlace = false;
  @observable showPlacesDialog = false;
  @observable showMoreButton = false;
  confirmPlaceTitle;
  confirmPlaceBody;
  map;
  placesService;
  placeLookupInterval = false;
  pagination;
  confirmPlaceMethod;
  nameInputRef;
  noteInputRef;

  @computed get hasGeocoords() {
    return !!this.state.note && !!this.state.note.geocode;
  }

  @computed get canSave() {
    return !!this.state.note && this.state.note.name.length > 0 && this.state.note.note.length > 0;
  }

  constructor(props) {
    super(props);
    this.notebookStore = this.props.rootStore.notebookStore;
    this.noteStore = this.props.rootStore.noteStore;
    this.uiStore = this.props.rootStore.uiStore;
    this.mode = props.location.pathname.indexOf('new') === -1 ? 'edit' : 'new';
    let notebook_id = this.notebookStore.activeId;
    if (this.mode === 'edit') {
      this.state = {
        'note': false,
        'searchInput': ''
      };
      this.noteStore.setActiveById(props.match.params.note_id)
        .then(() => {
          const note = {...this.noteStore.active};
          this.setState({note});
        })
        .catch(err => {
          if (err.message.toLowerCase() === 'not found') {
            this.messageTitle = 'Note Not Found';
            this.messageBody = 'No note was found matching the given id.';
            this.modalConfirm = this.closeOnError.bind(this);
            this.showMessage = true;
          }
        });
    } else {
      notebook_id = props.match.params.notebook_id;
      this.state = {
        'note': this.noteStore.getNoteObject(notebook_id),
        'searchInput': ''
      };
      // get current location
      this.updateCoordinates(false);
    }
  }

  closeOnError() {
    //console.log(`NoteEdit.closeOnError()`);
    this.props.history.replace('/notebooks');
  }

  closeNoteEdit() {
    //console.log(`NoteEdit.closeNoteEdit()`);
    if (this.mode === 'new') {
      this.props.history.replace('/notebook/' + this.props.match.params.notebook_id);
    } else if (this.mode === 'edit') {
      this.props.history.replace('/note/' + this.noteStore.activeId);
    }
  }

  @action
  nextPage() {
    console.log(`NoteEdit.nextPage()`);
    this.mobilePage++;
  }

  @action
  previousPage() {
    //console.log(`NoteEdit.nextPage()`);
    this.mobilePage--;
  }

  onNameChange(e) {
    //console.log(`NoteEdit.onNameChange() ${e.target.value}`);
    const note = {...this.state.note};
    note.name = e.target.value;
    this.setState({note});
  }

  onNoteChange(e) {
    //console.log(`NoteEdit.onNoteChange() ${e.target.value}`);
    const note = {...this.state.note};
    note.note = e.target.value;
    this.setState({note});
  }

  saveNote() {
    //console.log(`NoteEdit.saveNote()`);
    if (this.mode === 'new') {
      this.noteStore.createNote(this.state.note)
        .then(response => {
          this.props.history.replace('/note/'+this.noteStore.activeId);
        })
    } else {
      this.noteStore.updateNote(this.state.note)
        .then(response => {
          this.props.history.replace('/note/'+this.noteStore.activeId);
        })
    }
  }

  updateCoordinates(userAction) {
    //console.log(`NoteEdit.updateCoordinates() userAction: ${userAction}`);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        //console.dir(position);
        let latlonObj = {
          lat: Number(position.coords.latitude.toFixed(7)),
          lng: Number(position.coords.longitude.toFixed(7))
        };
        const note = {...this.state.note};
        note.geocode = latlonObj;
        this.setState({note});
        // clear any loaded places
        this.places = [];
      },
      (err) => {
        console.warn(`NoteEdit.updateCoordinates() ERROR(${err.code}): ${err.message}`);
        //console.dir(err);
        if (err.message === 'User denied Geolocation') {
          this.locationDenied = true;
          if (userAction) {
            this.messageTitle = 'User Denied Geolocation';
            this.messageBody = 'Access to browser geolocation data has been denied. You must allow access to that data to enable this feature. This can be done in your browser settings.';
            this.messageClass = 'warn';
            this.showMessage = true;
          }
        } else if (userAction) {
          this.messageTitle = 'Geolocation Failed';
          this.messageBody = 'Your device was unable to determine your current location.';
          this.messageClass = 'notify';
          this.showMessage = true;
        }
      },
      {
        enableHighAccuracy: true
      }
    );
  }

  modalConfirm() {
    //console.log(`NoteEdit.modalConfirm()`);
    this.showMessage = false;
  }

  findPlace() {
    //console.log(`NoteEdit.findPlace() place [${this.lookupPlaceName}]`);
    const options = {
      location: {...this.state.note.geocode},
      radius: 1000 // meters
    };
    if (this.lookupPlaceName) {
      options.keyword = this.lookupPlaceName;
    }
    // Check to see if places have already been loaded
    if (this.places.length > 0) {
      this.showPlacesDialog = true;
    } else {
      this.placesService.nearbySearch(options, (res, status, pagination) => {
        //console.log(`NoteEdit.findPlace() status: ${status}`);
        if (status !== 'OK') {
          if (status === 'ZERO_RESULTS') {
           // no results same as places[].length === 0
          } else {
            this.showServiceFailure();
            return;
          }
        }
        this.places ? this.places = this.places.concat(res) : this.places = res;
        this.showPlacesDialog = true;
        if (pagination.hasNextPage) {
          this.showMoreButton = true;
          this.pagination = pagination;
        } else {
          this.showMoreButton = false;
          this.pagination = null;
        }
      });
    }
  }

  clearPlace() {
    //console.log(`NoteEdit.clearPlace()`);
    const note = {...this.state.note};
    delete note.place;
    //note.place = undefined;
    this.setState({note});
  }

  onSearchInputChange(e) {
    //console.log(`NoteEdit.onSearchInputChange() ${e.target.value}`);
    const searchInput = e.target.value;
    this.setState({searchInput});
  }

  onSearchPlace() {
    //console.log(`NoteEdit.onSearchPlace() ${this.state.searchInput}`);
    const location = this.state.searchInput;
    const options = {
      query: location
    };
    // Make sure we have valid geocoordinates
    if (this.hasGeocoords) {
      options.location = this.state.note.geocode
    }
    // perform Places textSearch
    this.placesService.textSearch(options, (res, status) => {
      //console.log(`NoteEditor.searchForLocation() status [${status}] results`);
      // TODO Future option for displaying multiple results
      if (status === 'OK') {
        const loc = res[0];
        //this.note.geocode = this.note.geocode || {};
        const note = {...this.state.note};
        note.geocode = {
          lat: Number(loc.geometry.location.lat().toFixed(7)),
          lng: Number(loc.geometry.location.lng().toFixed(7))
        };
        this.setState({note});
        /* Give user the option to select matched place */
        if (loc.place_id) {
          this.confirmPlaceTitle = 'Add Place';
          this.confirmPlaceBody = [
            `Your search for "${location}" found place information for `,
            <span><img src={loc.icon} alt="location icon" width="25" height="25" style={{verticalAlign: 'middle'}}/><b>{loc.name}</b></span>,
            `. Would you like to save this with your note?`];
          this.confirmPlaceMethod = this.placeSelected.bind(this, loc);
          this.showConfirmPlace = true;
        }
      } else if (status === 'ZERO_RESULTS') {
        this.messageTitle = 'No Results';
        this.messageBody = `Your search for [${location}] return no results.`;
        this.messageClass = 'notify';
        this.showMessage = true;
      } else {
        this.showServiceFailure();
      }
    })
  }

  moreSelected() {
    //console.log(`NoteEdit.moreSelected()`);
    if (this.pagination) {
      this.pagination.nextPage();
    }
  }

  placeSelected(place) {
    //console.log(`NoteEdit.placeSelected()`);
    let options = {
      placeId: place.place_id,
      fields:['name', 'url']
    };
    this.placesService.getDetails(options, (placeDetail, status) => {
      //console.log(`NoteEdit.placeSelected() place details [${status}]`);
      if (status === 'OK') {
        const note = {...this.state.note};
        note.place = {
          name: place.name,
          icon: place.icon,
          url: placeDetail.url,
          _id: place.place_id
        };
        note.geocode = {
          lat: Number(place.geometry.location.lat().toFixed(7)),
          lng: Number(place.geometry.location.lng().toFixed(7))
        };
        this.setState({note});
        // hide the 2 potential dialogs that call this method
        this.showPlacesDialog = false;
        this.showConfirmPlace = false;
      } else {
        console.warn(`NoteEdit.placeSelected() Error [${status}] getting Place details`);
      }
    });
  }

  showServiceFailure() {
    //console.log(`NoteEditor.showServiceFailure()`);
    this.messageTitle = 'Service Failure';
    this.messageBody = 'There was a problem searching for places at your current location.';
    this.showMessage = true;
  }

  onMapMarkerDrop(e) {
    const note = {...this.state.note};
    note.geocode = {
      lat: Number(e.latLng.lat().toFixed(7)),
      lng: Number(e.latLng.lng().toFixed(7))
    };
    this.setState({note});
    // clear any loaded places
    this.places = [];
  }

  registerMap(map) {
    //console.log(`NoteEdit.registerMap()`);
    this.map = map;
    this.placesService = new window.google.maps.places.PlacesService(map);
  }

  onPlaceNameChange(e) {
    //console.log(`NoteEdit.onPlaceNameChange() ${e.target.value}`);
    this.lookupPlaceName = e.target.value;
    //
    if (this.placeLookupInterval) {
      clearTimeout(this.placeLookupInterval);
    }
    this.placeLookupInterval = setTimeout(() => {
      this.places = [];
      this.findPlace()
    }, 750);
  }

  setNameRef(ref) {
    //console.log(`NoteEdit.setNameRef()`);
    this.nameInputRef = ref;
    // set focus on name input when view renders
    if (ref) ref.focus();
  }

  setNoteRef(ref) {
    //console.log(`NoteEdit.setNoteRef()`);
    this.noteInputRef = ref;
    // set focus on note input when view renders
    if (ref) ref.focus();
  }

}

export default NoteEdit;