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
import soundManifest from './sounds/asset_manifest.json';
import imageManifest from './utils/imageManifest';
import { checkForTouchScreens, preloadImage } from './utils';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: [],
      loadProgress: 0,
      totalAssets: 0,
      assetList: [],
    };

    this.playSound = this.playSound.bind(this);
    this.incrementLoader = this.incrementLoader.bind(this);
    this.handleLoadProgress = this.handleLoadProgress.bind(this);
  }

  componentWillMount() {
    console.log(imageManifest.length, soundManifest.manifest.length);
    const imageUrls = imageManifest.map(image => image.download_url);
    console.log(imageUrls);
    const totalAssets = imageManifest.length + soundManifest.manifest.length;
    this.setState({
      totalAssets,
    });
  }

  componentDidMount() {
    checkForTouchScreens();
    const imageUrls = imageManifest.map(image => image.download_url);
    this.preloadImages(imageUrls, () => {
      this.incrementLoader(1);
      this.handleLoadProgress();
    });
  }

  componentDidUpdate() {
    this.handleLoadProgress();
    if (this.state.loadProgress === this.state.totalAssets && !this.props.appState.loaded) {
      console.log('setLoaded');
      this.props.actions.setLoaded();
    }
  }

  preloadImages(urls, allImagesLoadedCallback) {
    let loadedCounter = 0;
    const toBeLoadedNumber = urls.length;
    urls.forEach((url, idx) => {
      preloadImage(url, () => {
        this.incrementLoader(1);
        const assetList = [...this.state.assetList];
        assetList.push(idx);
        this.setState({ assetList });
        loadedCounter += 1;
        if ( toBeLoadedNumber - loadedCounter < 2 ) {
          console.log(this.state.assetList);
        }
        if (loadedCounter === toBeLoadedNumber) {
          allImagesLoadedCallback();
        }
      });
    });
  }

  playSound(item) {
    if (this.props.appState.sound) {
      // can't get this one to work with react-howler
      // for overlapping play requests, so defaulting to plain old html5 audio
      if (item === 'movement') {
        const sound = document.createElement('audio');
        const source = document.createElement('source');
        if (sound.canPlayType('audio/ogg;')) {
          source.type = 'audio/ogg';
          source.src = 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/sounds/pop_drip.ogg';
        } else {
          source.type = 'audio/mpeg';
          source.src = 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/sounds/pop_drip.mp3';
        }
        sound.appendChild(source);
        sound.setAttribute('autoplay', 'autoplay');
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
      } else {
        const playing = [...this.state.playing];
        const index = playing.indexOf(item);
        if (index === -1) {
          playing.push(item);
        }
        this.setState({
          playing,
        });
      }
    }
  }

  incrementLoader(num) {
    let loadProgress = this.state.loadProgress;
    loadProgress += num;
    this.setState({
      loadProgress,
    });
  }

  handleLoadProgress() {
    console.log(this.state.loadProgress, this.state.totalAssets);
    console.log(this.state.loadProgress / this.state.totalAssets);
    if (document.getElementById('progress') &&
        document.getElementById('progress-wrap')) {
      document.getElementById('progress').style.width =
      `${((this.state.loadProgress / this.state.totalAssets) * document.getElementById('progress-wrap').clientWidth)}px`;
    }
  }

  render() {
    const logError = id => console.log(`error: ${id}`);
    const manifest = soundManifest.manifest;
    const onLoad = (id) => {
      console.log(`loaded: ${id}`);
      this.incrementLoader(1);
      this.handleLoadProgress();
      const assetList = [...this.state.assetList];
      assetList.push(id);
      this.setState({ assetList });
    };
    const onEnd = (id) => {
      const playing = [...this.state.playing];
      const index = playing.indexOf(id);
      if (index > -1) {
        playing.splice(index, 1);
      }
      this.setState({
        playing,
      });
    };
    const preloadSounds = manifest.map((sound) => {
      const { id, src, volume } = sound;
      return (
        <ReactHowler
          src={src}
          key={id}
          preload
          playing={this.state.playing.includes(id)}
          volume={volume}
          onLoad={() => onLoad(id)}
          onEnd={() => onEnd(id)}
          onLoadError={() => {
            logError(id);
          }}
        />
      );
    });
    return (
      <BrowserRouter>
        <main className="main" id="main">
          {preloadSounds}
          <Switch>
            <Route
              exact
              path="/"
              render={routeProps => (
                <Splash
                  {...routeProps}
                  playSound={this.playSound}
                  loaded={this.state.loadProgress / this.state.totalAssets}
                />
                )
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
