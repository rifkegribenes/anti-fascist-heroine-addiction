import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Splash from './containers/Splash';
import Board from './containers/Board';
import * as Actions from './store/actions';

const App = () => (
  <BrowserRouter>
    <main className="main" id="main">
      <Switch>
        <Route exact path="/" component={Splash} />
        <Route path="/play" component={Board} />
      </Switch>
    </main>
  </BrowserRouter>
  );


const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
