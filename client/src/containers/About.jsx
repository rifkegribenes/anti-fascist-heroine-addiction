import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../store/actions';
import teamHeroes from '../utils/teamHeroes';
import SetDifficulty from './SetDifficulty';
import Sorry from './Sorry';

const heroCredits = teamHeroes.map(hero => (
  <div className="splash__item" key={hero.name}>
    <div className="about__avatar-wrap">
      <img src={hero.cardUrl} alt={hero.name} className="card-pic card-pic--round" />
      <div className="about__name">{hero.name}</div>
    </div>
    <div className="about__text-wrap">
          Character created by: {hero.createdBy || ''}<br />
          Image source:&nbsp;
      <a
        className="splash__link"
        href={hero.srcUrl}
        rel="noopener noreferrer"
        target="_blank"
      >{hero.srcName}</a><br />
          Artwork by: {hero.artBy || 'Unknown'}
    </div>
  </div>
  ));

const otherCredits = (
  <div>
    <div className="splash__item">
      <div className="splash__avatar-wrap">
        <img src="./img/bush_200.png" alt="George W. Bush" className="card-pic" />
      </div>
      <div className="splash__text-wrap">
        <span className="splash__bold">George W. Bush</span><br />
          Modified from&nbsp;
        <a
          className="splash__link"
          href="https://www.artfire.com/ext/shop/product_view/DressXpress/12389222/george_w_bush_face_with_horns_die-cut_decal_car_window_wall_bumper_phone_laptop/commercial/home_and_garden/home_decor"
          rel="noopener noreferrer"
          target="_blank"
        >this image</a>&nbsp;(artist unknown)<br />
          All other monster images by <a className="splash__link" href="https://github.com/rifkegribenes" target="blank" rel="noopener noreferrer">@rifkegribenes</a>
      </div>
    </div>
    <div className="splash__item splash__item--food">
      <div className="splash__avatar-wrap splash__avatar-wrap--multi">
        <img src="./img/raspberry_200.png" alt="raspberry" className="card-pic" />
        <img src="./img/pear_200.png" alt="pear" className="card-pic" />
        <img src="./img/plum_200.png" alt="plum" className="card-pic" />
        <img src="./img/kiwi_200.png" alt="kiwi" className="card-pic" />
      </div>
      <div className="splash__text-wrap splash__text-wrap--right">
        <a
          className="splash__link"
          href="http://all-free-download.com/free-vector/download/glossy-fruits-icon-set_310473.html"
          rel="noopener noreferrer"
          target="_blank"
        >Source</a>
      </div>
    </div>
    <div className="splash__item splash__item--food">
      <div className="splash__avatar-wrap splash__avatar-wrap--multi">
        <img src="./img/cherries_200.png" alt="cherries" className="card-pic" />
        <img src="./img/apple_200.png" alt="apple" className="card-pic" />
      </div>
      <div className="splash__text-wrap splash__text-wrap--right">
        <a
          className="splash__link"
          href="http://all-free-download.com/free-vector/download/fresh-fruit-and-ice-cream-vector-set_573611.html"
          rel="noopener noreferrer"
          target="_blank"
        >Source</a>
      </div>
    </div>
    <div className="splash__item splash__item--food">
      <div className="splash__avatar-wrap splash__avatar-wrap--multi">
        <img src="./img/popsicle_200.png" alt="popsicle" className="card-pic" />
      </div>
      <div className="splash__text-wrap splash__text-wrap--right">
        <a
          className="splash__link"
          href="http://all-free-download.com/free-vector/download/fresh-fruit-and-ice-cream-vector-set_573615.html"
          rel="noopener noreferrer"
          target="_blank"
        >Source</a>
      </div>
    </div>
    <div className="splash__item splash__item--food">
      <div className="splash__avatar-wrap splash__avatar-wrap--multi">
        <img src="./img/cupcake_200.png" alt="cupcake" className="card-pic" />
      </div>
      <div className="splash__text-wrap splash__text-wrap--right">
        <a
          className="splash__link"
          href="http://all-free-download.com/free-vector/download/fresh-fruit-and-ice-cream-vector-set_573613.html"
          rel="noopener noreferrer"
          target="_blank"
        >Source</a>
      </div>
    </div>
    <div className="splash__item splash__item--food">
      <div className="splash__avatar-wrap splash__avatar-wrap--multi">
        <img src="./img/hamburger_200.png" alt="hamburger" className="card-pic" />
        <img src="./img/ice-cream_200.png" alt="ice cream" className="card-pic" />
        <img src="./img/donut_200.png" alt="donut" className="card-pic" />
        <img src="./img/fries_200.png" alt="fries" className="card-pic" />
      </div>
      <div className="splash__text-wrap splash__text-wrap--right">
        <a
          className="splash__link"
          href="http://freedesignfile.com/117940-fast-food-and-chocolate-with-ice-cream-icons-vector/"
          rel="noopener noreferrer"
          target="_blank"
        >Source</a>
      </div>
    </div>
  </div>
  );


const About = props => (
  <div>
    {props.appState.modalType === 'difficulty' &&
      <SetDifficulty
        playSound={props.playSound}
        history={props.history}
      />
    }
    {props.appState.modalType === 'sorry' &&
      <Sorry
        playSound={props.playSound}
        history={props.history}
      />
    }
    <div className="splash">
      <div className="splash__container">
        <div className="splash__header">
          <h2 className="splash__title">Credits</h2>
        </div>
        <div className="splash__btn-wrap">
          <button
            className="big-msg__btn big-msg__btn--flex"
            onClick={() => {
              props.playSound('movement');
              props.history.push('/');
            }}
          ><span className="rainbow">How to play</span></button>
          <button
            className="big-msg__btn"
            onClick={() => {
              props.playSound('movement');
              if (document.body.classList.contains('touchscreen') || window.innerWidth < 1000) {
                props.actions.openModal('sorry');
              } else {
                props.actions.openModal('difficulty');
              }
            }}
          >
            <span className="rainbow">Start Game</span></button>
        </div>
        <div className="splash__instructions">
          <p className="splash__center">Game design, code, and all artwork not credited below by <a className="splash__link" href="https://github.com/rifkegribenes" target="blank" rel="noopener noreferrer">@rifkegribenes</a>.<br />This project was created to fulfill the <a className="splash__link" href="https://www.freecodecamp.org/challenges/build-a-roguelike-dungeon-crawler-game" target="_blank" rel="noopener noreferrer">RogueLike Dungeon Crawler</a> assignment for freeCodeCamp.<br />Thanks to Max and Leo T for beta testing and to Jay Schwane for the name.</p>
          <p className="splash__center">If you find a bug or have a feature request, please submit that <a className="splash__link" href="https://github.com/rifkegribenes/anti-fascist-heroine-addiction/issues" target="blank" rel="noopener noreferrer">here.</a><br />If you just want to say some opinions about this game and don&rsquo;t have a github account you could write to me at rifkegribenes at the gmails.</p>
          <h3 className="splash__subhead">Artwork</h3>
          <h4 className="splash__bold">Heroes</h4>
          <div className="splash__list">
            {heroCredits}
          </div>
          <h4 className="splash__bold">Other artwork</h4>
          <div className="splash__list">
            {otherCredits}
          </div>
          <h3 className="splash__subhead">Sounds</h3>
          Sounds from free packs provided by&nbsp;
          <a
            className="splash__link"
            href="https://freesound.org/people/LittleRobotSoundFactory/"
            rel="noopener noreferrer"
            target="_blank"
          >
           LittleRobotSoundFactory</a> and the&nbsp;
          <a
            className="splash__link"
            href="https://opengameart.org/content/512-sound-effects-8-bit-style"
            rel="noopener noreferrer"
            target="_blank"
          >8-bit sound effects pack</a> by&nbsp;
          <a
            className="splash__link"
            href="https://opengameart.org/users/subspaceaudio"
            rel="noopener noreferrer"
            target="_blank"
          >Juhani Junkala (SubSpace Audio)</a>
        </div>
        <div className="modal__btn-wrap">
          <a
            className="big-msg__btn big-msg__btn--icon"
            href="http://www.facebook.com/sharer.php?u=http://anti-fascist-heroine-addiction.surge.sh/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="rainbow icon icon-facebook" />
          </a>
          <a
            className="big-msg__btn big-msg__btn--icon"
            href="https://twitter.com/share?url=http://anti-fascist-heroine-addiction.surge.sh/&text=Anti-Fascist%20Heroine%20Addiction%2C%20The%20Game%3A%20Chase%20Ted%20Cruz%27s%20disembodied%20head%20around%20the%20gameboard%20and%20punch%20it."
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="rainbow icon icon-twitter" />
          </a>
          <a
            className="big-msg__btn big-msg__btn--icon"
            href="http://www.tumblr.com/share/link?url=http://anti-fascist-heroine-addiction.surge.sh/&name=Anti-Fascist%20Heroine%20Addiction%2C%20The%20Game&description=Chase%20Ted%20Cruz%27s%20disembodied%20head%20around%20the%20gameboard%20and%20punch%20it."
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="rainbow icon icon-tumblr" />
          </a>
        </div>
      </div>
    </div>
  </div>
    );

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(About);
