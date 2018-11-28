import React, { Component } from 'react'
import './EditNotebookDialog.scss'

class EditNotebookDialog extends Component {

  nameInput;

  constructor(props) {
    super(props);
    const notebook = props.notebook ? {...props.notebook} : {name:'', Created_date: new Date()};
    this.state = {
      notebook : notebook,
      mode : props.mode
    };
  }

  componentDidMount() {
    //console.log(`EditNotebookDialog.componentDidMount() mode: ${this.props.mode}`);
    this.nameInput.focus();
  }

  closeDialog() {
    console.log(`EditNotebookDialog.closeDialog()`);
    this.props.onClose();
  };

  saveNotebook() {
    console.log(`EditNotebookDialog.saveNotebook()`);
    const notebook = {...this.state.notebook};
    this.props.onSave(notebook);
  };

  onNameChange(e) {
    console.log(`EditNotebookDialog.onNameChange()`);
    const notebook = {...this.state.notebook};
    notebook.name = e.target.value;
    this.setState({notebook});
  }

  render() {
    return (
      <div className="modal-mask edit-notebook">

        <div className="modal-wrapper">

          <div className="modal-container">

            <div className="modal-header">
              {this.props.mode === 'edit' ?
                <h3>Edit Notebook Name</h3>
                :
                <h3>Create a New Notebook</h3>
              }
            </div>

            <div className="modal-body">
              <input ref={input => this.nameInput = input} type="text" id="notebookName" value={this.state.notebook.name} onChange={this.onNameChange.bind(this)} maxLength="40" placeholder="Enter a name" />
              <span className="input-info">
                Maximum 40 characters (<span className={this.state.notebook.name.length < 30 ? 'char-count' : 'char-count-close'}>{40 - this.state.notebook.name.length}</span> remaining)
              </span>
            </div>

            <div className="modal-footer">
              <button className="modal-optional-button" onClick={this.closeDialog.bind(this)}>
                Cancel
              </button>
              <button className="modal-default-button" onClick={this.saveNotebook.bind(this, this.state.notebook)}>
                Save
              </button>
            </div>

          </div>

        </div>

      </div>
    )
  }
}

export default EditNotebookDialog