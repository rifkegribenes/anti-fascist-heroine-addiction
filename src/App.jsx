import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactHowler from 'react-howler';

import Splash from './containers/Splash';
import Board from './containers/Board';
import About from './containers/About';
import HeroPicker from './containers/HeroPicker';
import BigMsg from './containers/BigMsg';
import * as Actions from './store/actions';
// import assetLoader from './utils/asset_loader';
// import sounds from './utils/sounds';
import manifest from './sounds/asset_manifest.json';
import { checkForTouchScreens } from './utils';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: null,
      loaded: 0,
    };

    this.playSound = this.playSound.bind(this);
  }

  componentDidMount() {
    checkForTouchScreens();
    // assetLoader().then(result =>
    //   console.log(result)).catch(err => console.log(err));
  }

  componentDidUpdate() {
    if (this.state.loaded === 17 && !this.props.appState.loaded) {
      console.log('set loaded');
      this.props.actions.setLoaded();
    }
  }

  playSound(item) {
    if (this.props.appState.sound) {
      let playing = this.state.playing;
      playing = item;
      this.setState({
        playing,
      });
    }
  }

  incrementLoader() {
    let soundsLoaded = this.state.loaded;
    soundsLoaded += 1;
    this.setState({
      loaded: soundsLoaded,
    });
  }

  handleLoadProgress() {
    if (document.getElementById('progress') &&
        document.getElementById('progress-wrap')) {
      document.getElementById('progress').style.width =
      `${((this.state.loaded / 17) * document.getElementById('progress-wrap').clientWidth)}px`;
    }
  }

  render() {
    const logError = id => console.log(`error: ${id}`);
    const onLoad = () => {
      this.incrementLoader();
      this.handleLoadProgress();
    };
    const assetManifest = manifest.manifest;
    const preloadSounds = assetManifest.map(sound => (
      <ReactHowler
        src={sound.src}
        key={sound.id}
        preload
        playing={this.state.playing === sound.id}
        volume={sound.volume}
        onLoad={onLoad}
        onLoadError={() => {
          logError(sound.id);
        }}
      />));
    return (
      <BrowserRouter>
        <main className="main" id="main">
          {preloadSounds}
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
