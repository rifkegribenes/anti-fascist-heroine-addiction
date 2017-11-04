import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import * as Actions from '../store/actions';
import teamHeroes from '../utils/teamHeroes';

const heroCredits = teamHeroes.map(hero => (
  <div className="splash__item">
    <div className="splash__avatar-wrap">
      <img src={hero.cardUrl} alt={hero.name} className="card-pic card-pic--round" />
    </div>
    <div className="splash__text-wrap">
      <span className="splash__bold">{hero.name}</span><br />
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

const monsterCredits = (
  <div className="splash__item">
    <div className="splash__avatar-wrap">
      <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/bush_200.png" alt="George W. Bush" className="card-pic" />
    </div>
    <div className="splash__text-wrap">
      <span className="splash__bold">George W. Bush</span><br />
        Modified from this image (unknown source, for sale as a sticker
         from various sellers, including this one):<br />
      <a
        className="splash__link"
        href="https://www.artfire.com/ext/shop/product_view/DressXpress/12389222/george_w_bush_face_with_horns_die-cut_decal_car_window_wall_bumper_phone_laptop/commercial/home_and_garden/home_decor"
        rel="noopener noreferrer"
        target="_blank"
      >George W. Bush Vinyl Decal</a><br />
        All other monster images created by Sarah Schneider
    </div>
  </div>
  );

const foodCredits = (
  <div>
    <div className="splash__item splash__item--food">
      <div className="splash__avatar-wrap splash__avatar-wrap--multi">
        <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/raspberry_200.png" alt="raspberry" className="card-pic" />
        <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/pear_200.png" alt="pear" className="card-pic" />
        <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/plum_200.png" alt="plum" className="card-pic" />
        <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/kiwi_200.png" alt="kiwi" className="card-pic" />
      </div>
      <div className="splash__text-wrap">
        <a
          className="splash__link"
          href="http://all-free-download.com/free-vector/download/glossy-fruits-icon-set_310473.html"
          rel="noopener noreferrer"
          target="_blank"
        >Glossy fruits icon set free vector</a>
      </div>
    </div>
    <div className="splash__item splash__item--food">
      <div className="splash__avatar-wrap splash__avatar-wrap--multi">
        <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/cherries_200.png" alt="cherries" className="card-pic" />
        <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/apple_200.png" alt="apple" className="card-pic" />
      </div>
      <div className="splash__text-wrap">
        <a
          className="splash__link"
          href="http://all-free-download.com/free-vector/download/fresh-fruit-and-ice-cream-vector-set_573611.html"
          rel="noopener noreferrer"
          target="_blank"
        >Fresh fruit and ice cream vector set 05</a>
      </div>
    </div>
    <div className="splash__item splash__item--food">
      <div className="splash__avatar-wrap splash__avatar-wrap--multi">
        <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/popsicle_200.png" alt="popsicle" className="card-pic" />
      </div>
      <div className="splash__text-wrap">
        <a
          className="splash__link"
          href="http://all-free-download.com/free-vector/download/fresh-fruit-and-ice-cream-vector-set_573615.html"
          rel="noopener noreferrer"
          target="_blank"
        >Fresh fruit and ice cream vector set 01</a>
      </div>
    </div>
    <div className="splash__item splash__item--food">
      <div className="splash__avatar-wrap splash__avatar-wrap--multi">
        <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/cupcake_200.png" alt="cupcake" className="card-pic" />
      </div>
      <div className="splash__text-wrap">
        <a
          className="splash__link"
          href="http://all-free-download.com/free-vector/download/fresh-fruit-and-ice-cream-vector-set_573613.html"
          rel="noopener noreferrer"
          target="_blank"
        >Fresh fruit and ice cream vector set 03</a>
      </div>
    </div>
    <div className="splash__item splash__item--food">
      <div className="splash__avatar-wrap splash__avatar-wrap--multi">
        <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/hamburger_200.png" alt="hamburger" className="card-pic" />
        <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/ice-cream_200.png" alt="ice cream" className="card-pic" />
        <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/donut_200.png" alt="donut" className="card-pic" />
        <img src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/fries_200.png" alt="fries" className="card-pic" />
      </div>
      <div className="splash__text-wrap">
        <a
          className="splash__link"
          href="http://freedesignfile.com/117940-fast-food-and-chocolate-with-ice-cream-icons-vector/"
          rel="noopener noreferrer"
          target="_blank"
        >Fast food and chocolate with ice cream icons</a>
      </div>
    </div>
  </div>
  );


const About = () => (
  <div className="splash">
    <div className="splash__container">
      <div className="splash__header">
        <h2 className="splash__title">Credits</h2>
      </div>
      <div className="splash__instructions">
        <h3 className="splash__subhead">Artwork</h3>
        <h4 className="splash__bold">Heroes</h4>
        <div className="splash__list">
          {heroCredits}
        </div>
        <h4 className="splash__bold">Monsters</h4>
        <div className="splash__list">
          {monsterCredits}
        </div>
        <h4 className="splash__bold">Food</h4>
        <div className="splash__list">
          {foodCredits}
        </div>
        <div className="splash__btn-wrap">
          <Link className="big-msg__btn" to="/">How to play</Link>
          <Link className="big-msg__btn" to="/hero-picker">Start Game</Link>
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
