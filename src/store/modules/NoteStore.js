import { observable, computed, action } from 'mobx';

export default class NoteStore {

  rootStore;
  transportLayer;
  @observable isLoading = false;
  @observable all = [];
  @observable active = {};
  @observable errors = [];

  @computed get count() {
    return this.all.length;
  }

  @computed get activeId() {
    return this.active._id;
  }

  constructor(rootStore, transportLayer) {
    this.rootStore = rootStore;
    this.transportLayer = transportLayer;
  }

  getNoteObject(notebook_id) {
    //console.log(`NoteStore.getNoteObject() notebook_id: ${notebook_id}`);
    return {
      name: '',
      Created_date: new Date(),
      geocode: {
        lat: 0,
        lng: 0
      },
      note: '',
      notebook: notebook_id
    }
  }

  @action
  loadNotebookNotes(notebook_id) {
    //console.log('NoteStore.loadNotebookNotes()');
    this.isLoading = true;
    this.transportLayer.getNotebookNotes(notebook_id)
      .then(response => {
        this.all = response;
        this.isLoading = false;
        return Promise.resolve(response);
      })
      .catch(this.handleError.bind(this, 'loadNotebookNotes'))
  }

  @action
  createNote(note) {
    //console.log(`NoteStore.createNote() name: ${note.name}`);
    this.isLoading = true;
    return this.transportLayer.createNote(note)
      .then(response => {
        this.active = response;
        this.all.unshift(response);
        this.isLoading = false;
        return Promise.resolve(response);
      })
      .catch(this.handleError.bind(this, 'createNote'))
  }

  @action
  updateNote(note) {
    //console.log(`NoteStore.updateNote() id: ${note._id}`);
    this.isLoading = true;
    return this.transportLayer.updateNote(note)
      .then(response => {
        this.active = response;
        // update all[]
        const i = this.all.findIndex(n => n._id === response._id);
        if (i > -1) {
          this.all[i] = response;
        } else {
          console.warn(`NoteStore.updateNote() could not find index in all[] for id: ${response._id}`);
        }
        this.isLoading = false;
        return Promise.resolve(response);
      })
      .catch(this.handleError.bind(this, 'updateNote'))
  }

  @action
  removeNote(note) {
    const note_id = note._id;
   // console.log(`NoteStore.removeNote() id: ${note_id}`);
    this.isLoading = true;
    return this.transportLayer.removeNote(note)
      .then(response => {
        this.isLoading = false;
        if (response.success) {
          const i = this.all.findIndex(n => n._id === note_id);
          if (i > -1) {
            this.all.splice(i, 1);
            return Promise.resolve(response);
          }
        }
        return Promise.reject(new Error('Note removal was not successful!'));
    })
      .catch(this.handleError.bind(this, 'removeNote'))
  }

  @action
  setActive(note) {
    if (note) {
      //console.log(`NoteStore.setActive() ${note._id}`);
      this.active = note;
    } else {
      this.active = null;
    }
  }

  @action
  setPreviousActive() {
    if (this.all.length > 1) {
      //console.log(`NoteStore.setPreviousActive()`);
      const active_id = this.active._id;
      let i = this.all.findIndex(n => n._id === active_id);
      if (i > -1) {
        if (i === 0) i = this.all.length - 1;
        else i--;
        this.active = this.all[i];
        return Promise.resolve(this.active);
      } else {
        return Promise.reject(new Error('Could not find active note index'));
      }
    } else {
      return Promise.reject(new Error('Not enough items in collection'));
    }
  }

  @action
  setNextActive() {
    //console.log(`NoteStore.setNextActive()`);
    if (this.all.length > 1) {
      const active_id = this.active._id;
      let i = this.all.findIndex(n => n._id === active_id);
      if (i > -1) {
        if (i === this.all.length - 1) i = 0;
        else i++;
        this.active = this.all[i];
        return Promise.resolve(this.active);
      } else {
        return Promise.reject(new Error('Could not find active note index'));
      }
    } else {
      return Promise.reject(new Error('Not enough items in collection'));
    }
  }

  @action
  setActiveById(note_id) {
    //console.log(`NoteStore.setActiveById() ${note_id}`);
    let note;
    if (this.all.length > 0) {
      note = this.all.find(n => n._id === note_id);
      if (note) {
        this.active = note;
      } else {
        throw(new Error(`Could not find note for id: ${note_id}`));
      }
      return Promise.resolve(note);
    } else {
      this.isLoading = true;
      return this.transportLayer.getNote(note_id)
        .then(response => {
          if (response) {
            this.active = response;
            this.isLoading = false;
            return Promise.resolve(response);
          }
          return Promise.reject(new Error(`Failed to load note with id [${note_id}]`));
        })
        .catch(this.handleError.bind(this, 'setActiveById'))
    }
  }

  @action
  setNotebookNotes(notes) {
    //console.log(`NoteStore.setNotebookNotes() load ${notes.length} notes`);
    this.all = notes;
  }

  handleError(method, err) {
    console.warn(`NoteStore.${method}() Error`);
    console.dir(err);
    this.errors.push();
    this.isLoading = false;
    return Promise.reject(err);
  }

}