import React from 'react';
import {
  Routes, Route,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Howl} from 'howler';

import Splash from './containers/Splash';
import Board from './containers/Board';
import About from './containers/About';
import HeroPicker from './containers/HeroPicker';
import BigMsg from './containers/BigMsg';
import * as Actions from './store/actions';
import soundManifest from './sounds/asset_manifest.json';
import imgUrls from './utils/imageManifest';
import { checkForTouchScreens, preloadImage } from './utils';

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: [],
      loadProgress: 100,
      totalAssets: 0,
      assetList: [],
    };

    // this.soundEffects = new Howl({
    //   src: [effects/effects.webm’, effects/effects.mp3’],
    //   sprite: {
    //     correct_sound: [0, 2063.673469387755],
    //     incorrect_sound: [4000, 2063.673469387755],
    //     win_sound: [8000, 4519.183673469389]
    //   }
    // });

    this.playSound = this.playSound.bind(this);
    this.incrementLoader = this.incrementLoader.bind(this);
    this.handleLoadProgress = this.handleLoadProgress.bind(this);
  }

  componentDidMount() {
    checkForTouchScreens();
    this.preloadImages(imgUrls, () => {
      this.handleLoadProgress();
    });
    const totalAssets = imgUrls.length + soundManifest.manifest.length;
    this.setState({
      totalAssets,
    });
  }

  componentDidUpdate() {
    // this.handleLoadProgress();
    // if (this.state.loadProgress === this.state.totalAssets && !this.props.appState.loaded) {
    //   this.props.actions.setLoaded();
    // }
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
        console.log('this would play a sound');
        // const sound = document.createElement('audio');
        // const source = document.createElement('source');
        // if (sound.canPlayType('audio/ogg;')) {
        //   source.type = 'audio/ogg';
        //   source.src = './sounds/pop_drip.ogg?raw=true';
        // } else {
        //   source.type = 'audio/mpeg';
        //   source.src = './sounds/pop_drip.mp3?raw=true';
        // }
        // sound.appendChild(source);
        // console.log(sound);
        // sound.setAttribute('autoplay', 'autoplay');
        // const playPromise = sound.play();
        // // In browsers that don't support html5 audio,
        // // playPromise won’t be defined.
        // if (playPromise !== undefined) {
        //   playPromise.then(() => {
        //     getAudioContext().resume();
        //   }).catch((err) => {
        //     console.log(err);
        //   });
        } else {
          console.log('this browser does not support html5 audio');
        }
      } else {
        console.log('this would play a sound');
        // const playing = [...this.state.playing];
        // const index = playing.indexOf(item);
        // if (index === -1) {
        //   playing.push(item);
        // }
        // this.setState({
        //   playing,
        // });
        // console.log(this.state.playing);
        // getAudioContext().resume();
      // }
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
      this.incrementLoader(1);
      this.handleLoadProgress();
      const assetList = [...this.state.assetList];
      assetList.push(id);
      this.setState({ assetList });
      console.log(assetList);
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
      // console.log(id);
      return (
        <Howl
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
        <main className="main" id="main">
{/*          {preloadSounds}*/}
          <Routes>
            <Route
              path="/"
              element={
                <Splash
                  playSound={this.playSound}
                  loaded={this.state.loadProgress / this.state.totalAssets}
                  router={this.props.router}
                />
              }
            />
            <Route
              path="/about"
              element={<About playSound={this.playSound} router={this.props.router}/>
              }
            />
            <Route
              path="/hero-picker"
              element={<HeroPicker playSound={this.playSound} router={this.props.router}/>
              }
            />
            <Route
              path="/play"
              element={<Board playSound={this.playSound} router={this.props.router}/>
              }
            />
            <Route
              path="/gameover"
              element={<BigMsg playSound={this.playSound} router={this.props.router}/>
              }
            />
          </Routes>
        </main>
    );
  }
}


const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions }, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
