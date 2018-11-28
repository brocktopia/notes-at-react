
const host = window.location.protocol + '//' + window.location.host.substr(0, window.location.host.indexOf(':'));
const port = (window.location.protocol === 'https:') ? '3031' : '3030';
const serviceBase = host + ':' + port + '/';

module.exports = {

  getNotebooks() {
    const url = serviceBase + 'notebooks';
    //console.log(`NoteServices.getNotebooks() url: ${url}`);
    return fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      }, (err) => {
        console.warn(`NoteServices.getNotebooks() Error`);
        console.dir(err);
        throw err;
      })
  },

  getNotebook(notebook_id) {
    const url = serviceBase + 'notebook/' + notebook_id;
    //console.log(`NoteServices.getNotebook() url: ${url}`);
    return fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json()
            .then((err) => {
              throw err;
            });
        }
      }, (err) => {
        console.warn(`NoteServices.getNotebook() Error`);
        console.dir(err);
        throw err;
      })
  },

  getNotebookNotes(notebook_id) {
    const url = serviceBase + 'notes/' + notebook_id;
    //console.log(`NoteServices.getNotebookNotes() url: ${url}`);
    return fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .catch((err) => {
        console.warn(`NoteServices.getNotebookNotes() Error`);
        console.dir(err);
        throw err;
      })
  },

  getNote(note_id) {
    const url = serviceBase + 'note/' + note_id;
    //console.log(`NoteServices.getNote() url: ${url}`);
    return fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          throw new Error('Not found');
        } else {
          throw new Error(`Error Status: ${response.status}`);
        }
      }, (err) => {
        console.warn(`NoteServices.getNote() Error`);
        console.dir(err);
        throw err;
      })
  },

  createNotebook(notebook) {
    const url = serviceBase + 'notebooks';
    //console.log(`NoteServices.createNotebook() url: ${url}`);
    return fetch(url, {
      method:'POST',
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(notebook)
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .catch((err) => {
        console.warn(`NoteServices.createNotebook() Error`);
        console.dir(err);
        throw err;
      })
  },

  updateNotebook(notebook) {
    const url = serviceBase + 'notebook/' + notebook._id;
    //console.log(`NoteServices.updateNotebook() url: ${url}`);
    return fetch(url, {
      method:'PUT',
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(notebook)
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .catch((err) => {
        console.warn(`NoteServices.updateNotebook() Error`);
        console.dir(err);
        throw err;
      })
  },

  createNote(note) {
    const url = serviceBase + 'notes/' + note.notebook;
    //console.log(`NoteServices.createNote() url: ${url}`);
    return fetch(url, {
      method:'POST',
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(note)
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .catch((err) => {
        console.warn(`NoteServices.createNote() Error`);
        console.dir(err);
        throw err;
      })
  },

  updateNote(note) {
    const url = serviceBase + 'note/' + note._id;
    //console.log(`NoteServices.updateNote() url: ${url}`);
    return fetch(url, {
      method:'PUT',
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(note)
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .catch((err) => {
        console.warn(`NoteServices.updateNote() Error`);
        console.dir(err);
        throw err;
      })
  },

  removeNote(note) {
    const url = serviceBase + 'note/' + note._id;
    //console.log(`NoteServices.removeNote() url: ${url}`);
    return fetch(url, {
      method:'DELETE',
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(note)
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
      .catch((err) => {
        console.warn(`NoteServices.removeNote() Error`);
        console.dir(err);
        throw err;
      })
  },

  removeNotebook(notebook) {
    const url = serviceBase + 'notebook/' + notebook._id;
    //console.log(`NoteServices.removeNotebook() url: ${url}`);
    return fetch(url, {
      method:'DELETE',
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(notebook)
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
      .catch((err) => {
        console.warn(`NoteServices.removeNotebook() Error`);
        console.dir(err);
        throw err;
      })
  }

};