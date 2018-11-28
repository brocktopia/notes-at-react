import {observable, action} from 'mobx';

export default class UIStore {

  static get LIST_MODE() {
    return 'list';
  }

  static get MAP_MODE() {
    return 'map';
  }

  static get EDIT_MODE() {
    return 'edit';
  }

  static get ADD_MODE() {
    return 'add';
  }

  static get DESKTOP() {
    return 'desktop';
  }

  static get MOBILE() {
    return 'mobile';
  }

  rootStore;
  @observable notebooksMode = 'list'; // list | add
  @observable notebookMode = 'list'; // list | edit | map
  @observable editorDevice = (typeof window.orientation !== 'undefined') ? 'mobile' : 'desktop'; // desktop | mobile

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  setNotebookMode(mode) {
    //console.log(`UIState.setNotebookMode() ${mode}`);
    this.notebookMode = mode;
  }

  @action
  setNotebooksMode(mode) {
    //console.log(`UIState.setNotebooksMode() ${mode}`);
    this.notebooksMode = mode;
  }

  @action
  setEditorDevice(device) {
    //console.log(`UIState.setEditorDevice() ${device}`);
    this.editorDevice = device;
  }

}