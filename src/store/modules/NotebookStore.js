import {observable, computed, action} from 'mobx';

export default class NotebookStore {

  rootStore;
  transportLayer;
  @observable errors = [];
  @observable isLoading = false;
  @observable all = [];
  @observable active = {};

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

  @action
  loadNotebooks() {
    //console.log('NotebookStore.loadNotebooks()');
    if (this.all.length > 0) {
      return this.all;
    } else {
      this.isLoading = true;
      return this.transportLayer.getNotebooks()
        .then(response => {
          this.all = response;
          this.isLoading = false;
          return Promise.resolve(response);
        })
        .catch(this.handleError.bind(this, 'loadNotebooks'))
    }
  }

  @action
  setActive(notebook) {
    if (notebook) {
      //console.log(`NotebookStore.setActive() ${notebook._id}`);
      this.active = notebook;
    } else {
      this.active = null;
    }
  }

  @action
  setActiveById(notebook_id) {
    //console.log(`NotebookStore.setActiveById() ${notebook_id}`);
    let notebook;
    if (this.all.length > 0) {
      notebook = this.all.find(nb => nb._id === notebook_id);
      if (notebook) {
        this.active = notebook;
      } else {
        this.handleError(new Error(`Could not find notebook for id: ${notebook_id}`));
        //throw(new Error(`Could not find notebook for id: ${notebook_id}`));
      }
    } else {
      this.isLoading = true;
      return this.transportLayer.getNotebook(notebook_id)
        .then(response => {
          this.active = response;
          if (response.notes && response.notes.length) {
            this.rootStore.noteStore.setNotebookNotes(response.notes);
          }
          this.isLoading = false;
        })
        .catch(this.handleError.bind(this, 'setActiveById'))
    }
  }

  @action
  createNotebook(notebook) {
    this.isLoading = true;
    return this.transportLayer.createNotebook(notebook)
      .then(response => {
        this.all.unshift(response);
        this.isLoading = false;
      })
      .catch(this.handleError.bind(this, 'createNotebook'))
  }

  @action
  updateNotebook(notebook) {
    this.isLoading = true;
    return this.transportLayer.updateNotebook(notebook)
      .then(response => {
        this.active = response;
        this.isLoading = false;
      })
      .catch(this.handleError.bind(this, 'updateNotebook'))
  }

  @action
  removeNotebook(notebook) {
    const notebook_id = notebook._id;
    //console.log(`NoteStore.removeNote() id: ${notebook_id}`);
    this.isLoading = true;
    return this.transportLayer.removeNotebook(notebook)
      .then(response => {
        this.isLoading = false;
        if (response.success) {
          const i = this.all.findIndex(n => n._id === notebook_id);
          if (i > -1) {
            this.all.splice(i, 1);
            return Promise.resolve(response);
          }
        }
        return Promise.reject(new Error('Note removal was not successful!'));
      })
      .catch(this.handleError.bind(this, 'removeNotebook'))
  }

  @action
  handleError(method, err) {
    console.log(`NotebookStore.${method}() Error`);
    console.dir(err);
    //this.errors = this.errors.concat([err]);
    this.errors.push(err);
    this.isLoading = false;
    return Promise.reject(err);
  }

}