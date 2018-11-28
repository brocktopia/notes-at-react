import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { observable } from 'mobx';
import moment from 'moment'
import { AddItemIcon } from '../assets/SVGIcons'
import EditNotebookDialog from '../components/EditNotebookDialog'
import './Notebooks.scss'

const NotebookItems = (props) => {
  const notebooks = props.notebooks;
  const notebookItems = notebooks.map((notebook) => {
    return (
      <li className="list-item" onClick={props.callback.bind(this, notebook)} key={notebook._id}>
        <span className="list-item-name">{notebook.name}</span>
        <span className="notebook-date">{moment(notebook.Created_date).format("l")}</span>
      </li>
    )
  });
  return (
    <ul className="notebooks">{notebookItems}</ul>
  )
};

@inject('rootStore')
@observer
class Notebooks extends Component {

  @observable loadingMessage = 'Loading...';
  @observable showCreateNotebook = false;
  notebookStore;

  constructor(props) {
    super(props);
    this.notebookStore = this.props.rootStore.notebookStore;
    this.uiStore = this.props.rootStore.UIStore;
  }

  componentDidMount() {
    //console.log(`Notebooks.componentDidMount() path: ${this.props.match.path}`);
    if (this.props.match.path.includes('new')) {
      this.showCreateNotebook = true;
      this.props.history.replace('/notebooks');
    }
    this.notebookStore.loadNotebooks();
    // clear any active notebooks
    this.notebookStore.setActive(null);
  }

  addNotebook() {
    //console.log(`Notebooks.addNotebook()`);
    this.showCreateNotebook = true;
  }

  onCloseNewNotebook() {
    //console.log(`Notebooks.onCloseNewNotebook()`);
    this.showCreateNotebook = false;
  }

  onSaveNewNotebook(notebook) {
    //console.log(`Notebooks.onSaveNewNotebook()`);
    this.showCreateNotebook = false;
    this.loadingMessage = 'Saving Notebook...';
    this.notebookStore.createNotebook(notebook);
  }

  onNotebookSelect(notebook) {
    //console.log(`Notebooks.onNotebookSelect() ${notebook._id}`);
    this.notebookStore.setActive(notebook);
    this.props.history.push('/notebook/' + notebook._id);
  }

  render() {
    return (
      <div className="app-container notebooks">

        <header>
          <h2>Notebooks</h2>
          <span className="button-bar">
          <button className="icon add-notebook" onClick={this.addNotebook.bind(this)}><AddItemIcon title="Create Notebook" /></button>
          </span>
        </header>

        <div className="content">
          {(this.notebookStore.all.length === 0)  ?
            <div className="notebooks-message">No notebooks have been created.</div>
          :
            <NotebookItems notebooks={this.notebookStore.all} callback={this.onNotebookSelect.bind(this)}/>}
        </div>

        <div className="navigation">
          <Link to="/">Home</Link>
        </div>

        {this.showCreateNotebook &&
        <EditNotebookDialog mode="create" onSave={this.onSaveNewNotebook.bind(this)} onClose={this.onCloseNewNotebook.bind(this)}/>
        }

        {this.notebookStore.isLoading && <div className="loading-mask"><span>{this.loadingMessage}</span></div>}

      </div>
    );
  }

}

export default Notebooks;