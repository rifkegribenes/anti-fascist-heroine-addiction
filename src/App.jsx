import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Splash from './containers/Splash';
import Board from './containers/Board';
import About from './containers/About';
import HeroPicker from './containers/HeroPicker';
import BigMsg from './containers/BigMsg';
import * as Actions from './store/actions';
import * as aL from './utils/asset_loader';
import sounds from './utils/sounds';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.playSound = this.playSound.bind(this);
  }

  componentDidMount() {
    aL.assetLoader();
  }

  playSound(item) {
    console.log('App.jsx > playSound');
    if (this.props.appState.sound) {
      // aL.playSound(item);
      const sound = document.createElement('audio');
      sound.setAttribute('autoplay', 'autoplay');
      sound.setAttribute('src', sounds[item]);
      const playPromise = sound.play();
      // In browsers that don't support html5 audio,
      // playPromise won’t be defined.
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Automatic playback started!
        }).catch((err) => {
          console.log(err);
        });
      } else {
        console.log('this browser does not support html5 audio');
      }
    }
  }

  render() {
    return (
      <BrowserRouter>
        <main className="main" id="main">
          <Switch>
            <Route
              exact
              path="/"
              render={routeProps => <Splash {...routeProps} playSound={this.playSound} />
              }
            />
            <Route
              exact
              path="/about"
              render={routeProps => <About {...routeProps} playSound={this.playSound} />
              }
            />
            <Route
              exact
              path="/hero-picker"
              render={routeProps => <HeroPicker {...routeProps} playSound={this.playSound} />
              }
            />
            <Route
              exact
              path="/play"
              render={routeProps => <Board {...routeProps} playSound={this.playSound} />
              }
            />
            <Route
              exact
              path="/gameover"
              render={routeProps => <BigMsg {...routeProps} playSound={this.playSound} />
              }
            />
          </Switch>
        </main>
      </BrowserRouter>
    );
  }
}


const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
