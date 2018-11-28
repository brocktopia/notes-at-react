import UIStore from './modules/UIStore';
import NotebookStore from './modules/NotebookStore';
import NoteStore from './modules/NoteStore';
import NoteServices from '../services/NoteServices';

export default class RootStore {

  constructor() {
    this.uiStore = new UIStore(this);
    this.noteStore = new NoteStore(this, NoteServices);
    this.notebookStore = new NotebookStore(this, NoteServices);
  }

}