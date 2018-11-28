import React, { Component } from "react";
import { observer, inject } from "mobx-react"
import { observable, intercept } from 'mobx';
import { Link } from "react-router-dom"
import UIStore from '../store/modules/UIStore'
import moment from 'moment'
import './Notebook.scss'
import { DeleteItemIcon, EditItemIcon, ListIcon, MapIcon, AddItemIcon, PlaceIcon, LocationIcon } from '../assets/SVGIcons'
import EditNotebookDialog from "../components/EditNotebookDialog";
import ModalDialog from "../components/ModalDialog";

const NoteItems = (props) => {
  console.log(`NoteItems() create [${props.notes.length}] notes`);
  const notes = props.notes;
  if (!notes) return;
  const noteItems = notes.map((note) => {
    return (
      <li className="note-item" onClick={props.callback.bind(this, note)} key={note._id}>
        <span className="title">{note.name}</span><br/>
        <span className="date">{moment(note.Created_date).format('ddd l h:mm:ss a')}</span>
        {(!note.place || !note.place.name) && !!note.geocode &&
          <span className="geocoords">
            <LocationIcon title="Geolocation" className="icon-tiny location-icon"/>&nbsp;
            {(note.geocode.lat ? note.geocode.lat.toFixed(5) : 'Unknown') + ', ' + (note.geocode.lng ? note.geocode.lng.toFixed(5) : 'Unknown')}
          </span>
        }
        {(note.place && note.place.name) &&
          <span className="place">
            <PlaceIcon title="Place" className="icon-tiny place-icon" />
            {note.place.name}
          </span>
        }
        <br clear="all"/>
        <span className="note">{(note.note && note.note.length > 84) ? note.note.substr(0, 84) + '...' : note.note}</span>
      </li>
    )
  });
  return (
    <ul className="notebook">{noteItems}</ul>
  )
};

@inject('rootStore')
@observer
class Notebook extends Component {

  render() {
    return (
      <div className="app-container notebook">

        <header>
          <h2>Notebook</h2>
          <span className="button-bar">
            <button className="icon delete-notebook" onClick={this.deleteNotebook.bind(this)}><DeleteItemIcon title="Delete Notebook" /></button>
            <button className="icon edit-notebook" onClick={this.editNotebook.bind(this)}><EditItemIcon title="Edit Notebook" /></button>
            <button className="icon show-map" onClick={this.toggleMap.bind(this)}>
            {this.showMap ? <ListIcon title="Show Notebook List" /> : <MapIcon title="Show Map" />}
            </button>
            <button className="desktop-only icon add-note" onClick={this.addNote.bind(this)}><AddItemIcon title="Create Note" /></button>
            <button className="mobile-only icon" onClick={this.addNoteMobile.bind(this)}><AddItemIcon title="Create Note" /></button>
          </span>
        </header>

        <div className="content">
          <h2 className="main">{this.notebookStore.active.name}</h2>
          {(this.noteStore.all.length === 0)  ?
            <div className="notebooks-message">No notes have been created.</div>
            :
            <NoteItems notes={this.noteStore.all} callback={this.onNoteSelect.bind(this)}/>}
        </div>

        <div className="navigation">
          <Link to="/">Home</Link>
          &gt;
          <Link to="/notebooks">Notebooks</Link>
        </div>

        {this.showEditNotebook &&
        <EditNotebookDialog mode="edit" notebook={this.notebookStore.active} onSave={this.onSaveNotebook.bind(this)} onClose={this.onCloseEditNotebook.bind(this)}/>
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

        {(this.noteStore.isLoading || this.notebookStore.isLoading) && <div className="loading-mask"><span>{this.loadingMessage}</span></div>}

      </div>
    );
  }

  @observable loadingMessage = 'Loading...';
  @observable showMap = false;
  @observable showEditNotebook = false;
  @observable showConfirmDelete = false;
  confirmDeleteTitle = 'Confirm Notebook Delete';
  confirmDeleteBody;
  notebookStore;
  noteStore;
  uiStore;

  constructor(props) {
    super(props);
    this.notebookStore = this.props.rootStore.notebookStore;
    this.noteStore = this.props.rootStore.noteStore;
    this.uiStore = this.props.rootStore.uiStore;
    intercept(this.notebookStore.errors, this.notebookStoreError.bind(this));
    intercept(this.noteStore.errors, this.noteStoreError.bind(this));
  }

  componentDidMount() {
    const {notebook_id} = this.props.match.params;
    //console.log(`Notebook.componentDidMount() id [${notebook_id}]`);
    // check for active notebook in case of deep-linked first first load
    if (!this.notebookStore.active._id) {
      this.notebookStore.setActiveById(notebook_id)
    } else {
      this.noteStore.loadNotebookNotes(notebook_id);
    }
  }

  notebookStoreError(action) {
    console.warn(`Notebook.notebookStoreError()`);
    const err = action.added[action.added.length - 1];
    console.dir(err);
    if (err.name === 'CastError') {
      // service failure return to prior view
      this.props.history.go(-1);
    } else if (err.message === 'Failed to fetch') {
      console.warn(`Network error`);
      // services may be down--notify user
      this.props.history.go(-1);
    }
  }

  noteStoreError(action) {
    console.warn(`Notebook.noteStoreError()`);
    const err = action.added[action.added.length - 1];
    console.dir(err);
  }

  deleteNotebook() {
    //console.log(`Notebook.deleteNotebook()`);
    this.confirmDeleteBody = [
      'Are you sure you want to delete this notebook? ',
      this.noteStore.count > 0 ? <span key={0}><b style={{color:'darkred'}}>All {this.noteStore.count} notes</b> in this notebook will be deleted. </span> : '',
      'This can not be undone.'
    ];
    this.showConfirmDelete = true;
  }

  confirmDelete() {
    //console.log(`Notebook.confirmDelete()`);
    this.notebookStore.removeNotebook(this.notebookStore.active)
      .then(response => {
        this.props.history.replace('/notebooks');
        this.showConfirmDelete = false;
      })
      .catch(err => {
        console.warn(`Notebook.confirmDelete() Error`);
        console.dir(err);
        this.props.history.replace('/notebooks');
        this.showConfirmDelete = false;
      });

  }

  toggleMap() {
    //console.log(`Notebook.toggleMap()`);
    this.showMap = !this.showMap;
  }

  addNote() {
    //console.log(`Notebook.addNote()`);
    this.uiStore.setEditorDevice(UIStore.DESKTOP);
    this.props.history.push('/note-new/' + this.notebookStore.activeId);
  }

  addNoteMobile() {
    console.log(`Notebook.addNoteMobile()`);
    this.uiStore.setEditorDevice(UIStore.MOBILE);
    this.props.history.push('/note-new/' + this.notebookStore.activeId);
  }

  onNoteSelect(note) {
    //console.log(`Notebook.onNoteSelect() note_id: ${note._id}`);
    // TODO capture scroll position
    this.noteStore.setActive(note);
    this.props.history.push('/note/' + note._id);
  }

  editNotebook() {
    //console.log(`Notebook.editNotebook()`);
    this.showEditNotebook = true;
  }

  onCloseEditNotebook() {
    //console.log(`Notebook.onCloseEditNotebook()`);
    this.showEditNotebook = false;
  }

  onSaveNotebook(notebook) {
    //console.log(`Notebook.onSaveNotebook()`);
    this.showEditNotebook = false;
    this.loadingMessage = 'Saving Notebook...';
    this.notebookStore.updateNotebook(notebook);
  }

}

export default Notebook;