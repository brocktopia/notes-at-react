import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { observable, computed } from 'mobx';
import { MapComponent } from '../components/MapComponent';
import moment from 'moment'
import './Note.scss'
import { DeleteItemIcon, EditItemIcon, ListIcon, MapIcon, BackIcon, ForwardIcon, LaunchIcon, LocationIcon, CloseIcon } from '../assets/SVGIcons'
import ModalDialog from "../components/ModalDialog";

const NoteDate = (props) => {
  return (
    <div className="date">{props.date ? moment(props.date).format('LLLL') : ''}</div>
  )
};

const Geocords = (props) => {
  return (
    props.geocode ?
      <div className="geocoords">
        <a onClick={props.showMap} className="geocords-link">
          <LocationIcon title="Show on Map" />
          {props.geocode.lat +', '+props.geocode.lng}
        </a>
      </div>
      :
      null
  )
};

const Places = (props) => {
  return (
    props.place && props.place._id ?
      <div className="places">
        <img src={props.place.icon} alt="place icon" className="icon-tiny place-icon" />
        <span className="placeName">{props.place.name}</span>
        <a href={props.place.url} target="_blank" rel="noopener noreferrer" className="place-link">
          <LaunchIcon title="Goto Place"/>
        </a>
      </div>
      :
      null
  )
};

const NoteNote = (props) => {
  return (
    <p className="note">{props.note}</p>
  )
};

@inject('rootStore')
@observer
class Note extends Component {

  render() {
    return (
      <div className="app-container note">

        <header>
          <h2>Note</h2>
          <span className="button-bar">
            <button className="icon delete-note" onClick={this.deleteNote.bind(this)}><DeleteItemIcon title="Delete Note" /></button>
            <button className="mobile-only icon edit-note" onClick={this.editNote.bind(this, 'mobile')}><EditItemIcon title="Edit Note" /></button>
            <button className="desktop-only icon edit-note" onClick={this.editNote.bind(this, 'desktop')}><EditItemIcon title="Edit Note" /></button>
            <button className="icon show-map" onClick={this.toggleMap.bind(this)}>
              {this.showMap ? <ListIcon title="Show Note" /> : <MapIcon title="Show Map" />}
            </button>
            <button className="icon close-note" onClick={this.closeNote.bind(this)}><CloseIcon title="Close Note" /></button>
          </span>
        </header>

        <div className="content">
          <h2 className="main">{this.noteStore.active.name}</h2>
          {!this.showNoteMap ?
            <div className="body">
              <NoteDate date={this.noteStore.active.Created_date} />
              {this.noteStore.active.geocode &&
              <MapComponent
                center={this.noteStore.active.geocode}
                zoom={15}
                marker={{position:this.noteStore.active.geocode}}
                containerElement={<div style={{ height: `150px`, width: '200px', float: 'right' }} />}
              />
              }
              <Geocords geocode={this.noteStore.active.geocode} showMap={this.toggleMap.bind(this)} />
              <Places place={this.noteStore.active.place} />
              <NoteNote note={this.noteStore.active.note} />
            </div>
            :
            <MapComponent
              center={this.noteStore.active.geocode}
              zoom={15}
              showInfo={this.showMapInfo}
              data={this.noteData}
              marker={{ position:this.noteStore.active.geocode, onMarkerClick:this.handleMarkerClick.bind(this, this.noteStore.active)}}
              containerElement={<div style={{ height: `calc(100% - 50px)` }} />}
            />
          }

        </div>

        <div className="navigation">
          <Link to="/">Home</Link>
          &gt;
          <Link to="/notebooks">Notebooks</Link>
          &gt;
          <Link to={'/notebook/' + this.noteStore.active.notebook}>Notebook</Link>
          {(this.count > 1) &&
          <span className="icon-button-bar">
              <a onClick={this.previousNote.bind(this)}><BackIcon title="Previous Note"/></a>
              <a onClick={this.nextNote.bind(this)}><ForwardIcon title="Next Note"/></a>
            </span>
          }
        </div>

        {this.showMessage &&
        <ModalDialog
          modalType="notify"
          header={this.messageTitle}
          body={this.messageBody}
          onConfirm={this.confirmMessage.bind(this)}
        />
        }

        {this.showConfirmDelete &&
        <ModalDialog
          modalType="confirm"
          header={this.confirmDeleteTitle}
          body={this.confirmDeleteBody}
          onCancel={() => this.showConfirmDelete = false}
          onConfirm={this.confirmDelete.bind(this)}
        />
        }

        {this.noteStore.isLoading && <div className="loading-mask"><span>{this.loadingMessage}</span></div>}

      </div>
    );
  }

  @observable loadingMessage = 'Loading...';
  @observable showConfirmDelete = false;
  @observable showMessage = false;
  @observable showNoteMap = false;
  @observable showMapInfo = true;
  @observable noteData = {};
  messageTitle;
  messageBody;
  confirmMessage = function() {}; // function
  confirmDeleteTitle = 'Confirm Note Delete';
  confirmDeleteBody = 'Are you sure you want to delete this note? This can not be undone.';
  notebookStore;
  noteStore;
  uiStore;

  @computed get count() {
    return this.noteStore.all.length;
  }

  constructor(props) {
    super(props);
    this.notebookStore = this.props.rootStore.notebookStore;
    this.noteStore = this.props.rootStore.noteStore;
    this.uiStore = this.props.rootStore.uiStore;
  }

  componentDidMount() {
    const {note_id} = this.props.match.params;
    //console.log(`Note.componentDidMount() id [${note_id}]`);
    // check for active notebook in case of deep-linked first first load
    if (!this.noteStore.active._id) {
      this.noteStore.setActiveById(note_id)
        .then(() => {
          // get note data for maps
          this.initNoteData();
          // check for note collection
          if (this.count === 0) {
            // must be first load of deep-link into note view
            this.noteStore.loadNotebookNotes(this.noteStore.active.notebook);
          }
        })
        .catch(err => {
          console.warn(`Note.componentDidMount() Error loading note`);
          console.dir(err);
          if (err.message.toLowerCase() === 'not found') {
            this.messageTitle = 'Note Not Found';
            this.messageBody = 'No note was found matching the given id.';
            this.confirmMessage = this.closeOnError.bind(this);
            this.showMessage = true;
          }
        });
    } else {
      this.initNoteData();
    }
  }

  componentDidUpdate(prevProps) {
    // handle route changes based on browser navigation
    if (this.noteStore.isLoading) {
      return;
    }
    const {note_id} = this.props.match.params;
    const prev_id = prevProps.match.params.note_id;
    //console.log(`Note.componentDidUpdate() prev_id [${prev_id}] note_id [${note_id}]`);
    if (note_id !== prev_id && note_id !== this.noteStore.activeId) {
      this.noteStore.setActiveById(note_id);
    }
  }

  initNoteData() {
    let hasPlace = (this.noteStore.active.place && this.noteStore.active.place._id);
    this.noteData = {
      'name': this.noteStore.active.name,
      'date': moment(this.noteStore.active.Created_date).format('l h:mm:ss a'),
      'place': hasPlace ? this.noteStore.active.place : false,
      'note': this.noteStore.active.note.length > 200 ? this.noteStore.active.note.substr(0, 200) + '...' : this.noteStore.active.note,
      'note_id': this.noteStore.active._id
    }
  }

  deleteNote() {
    //console.log(`Note.deleteNote()`);
    this.showConfirmDelete = true;
  }

  confirmDelete() {
    const notebook_id = this.noteStore.active.notebook;
    //console.log(`Note.confirmDelete() notebook_id: ${notebook_id}`);
    this.noteStore.removeNote(this.noteStore.active)
      .then(response => {
        this.showConfirmDelete = false;
        this.props.history.replace('/notebook/' + notebook_id);
      })
      .catch(err => {
        console.warn(`Note.deleteNote() Error:`);
        console.dir(err);
      })
  }

  editNote(device) {
    //console.log(`Note.editNote() device: ${device}`);
    this.uiStore.setEditorDevice(device);
    this.props.history.push('/note-edit/'+this.noteStore.activeId);
  }

  toggleMap() {
    this.showNoteMap = !this.showNoteMap;
  }

  closeOnError() {
    //console.log(`Note.closeOnError()`);
    this.props.history.replace('/notebooks');
  }

  closeNote() {
    //console.log(`Note.closeNote()`);
    this.props.history.push('/notebook/'+this.noteStore.active.notebook);
  }

  previousNote() {
    //console.log(`Note.previousNote()`);
    this.noteStore.setPreviousActive()
      .then(note => {
        // update path
        this.props.history.push('/note/' + note._id);
      })
      .catch(err => {
        console.warn(`Note.previousNote() Error calling for previous note`);
        console.dir(err);
      });
  }

  nextNote() {
    //console.log(`Note.nextNote()`);
    this.noteStore.setNextActive()
      .then(note => {
        this.props.history.push('/note/' + note._id);
      })
      .catch(err => {
        console.warn(`Note.nextNote() Error calling for next note`);
        console.dir(err);
      });
  }

  handleMarkerClick(note, marker) {
    //console.log(`Note.handleMarkerClick()`);
    this.showMapInfo = !this.showMapInfo
  }

}

export default Note;