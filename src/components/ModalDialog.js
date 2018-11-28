import React from 'react'

const ModalDialog = (props) => (
  <div className="modal-mask">

    <div className="modal-wrapper">

      <div className={'modal-container ' + props.className}>

        <div className="modal-header">
          <h3>{props.header}</h3>
        </div>

        <div className="modal-body">
          {props.body}
        </div>

        {props.modalType === 'notify' &&
          <div className="modal-footer">
            <button className="modal-default-button" onClick={props.onConfirm}>
              OK
            </button>
          </div>
        }
        {props.modalType === 'confirm' &&
          <div className="modal-footer">
            <button onClick={props.onCancel}>
              Cancel
            </button>
            <button className="modal-default-button" onClick={props.onConfirm}>
              Confirm
            </button>
          </div>
        }
        {props.modalType === 'yesno' &&
          <div className="modal-footer">
            <button onClick={props.onCancel}>
              No
            </button>
            <button class="modal-default-button" onClick={props.onConfirm}>
              Yes
            </button>
          </div>
        }

      </div>

    </div>

  </div>
);

ModalDialog.defaultProps = {
  modalType: 'notify',
  className: ''
};

export default ModalDialog