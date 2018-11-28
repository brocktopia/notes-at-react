import React, { Component } from 'react';
import {
  Route,
  Switch,
  HashRouter,
} from 'react-router-dom';
import { Provider, observer } from 'mobx-react';
import { onError } from 'mobx-react'
import RootStore from './store/RootStore';
import Home from './views/Home';
import NavError from './views/NavError';
import Notebooks from './views/Notebooks';
import Notebook from './views/Notebook';
import Note from './views/Note';
import NoteEdit from './views/NoteEdit';
import './App.scss';

onError(error => {
  console.log('mobx-react error');
  console.dir(error);
});

@observer
class App extends Component {
  render() {
    //console.log(`App.render() React.version: ${React.version}`);
    return (
      <HashRouter>
        <Provider rootStore={new RootStore()}>
          <div id="app">
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route exact path="/notebooks" component={Notebooks}/>
              <Route exact path="/notebooks/new" component={Notebooks}/>
              <Route exact path="/notebook/:notebook_id" component={Notebook}/>
              <Route exact path="/note/:note_id" component={Note}/>
              <Route exact path="/note-edit/:note_id" component={NoteEdit}/>
              <Route exact path="/note-new/:notebook_id" component={NoteEdit}/>
              <Route path="*" component={NavError}/>
            </Switch>
          </div>
        </Provider>
      </HashRouter>
    );
  }
}

export default App;
