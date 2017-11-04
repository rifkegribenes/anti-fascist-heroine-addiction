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
          Image source: <a className="splash__link" href={hero.srcUrl}>{hero.srcName}</a><br />
          Artwork by: {hero.artBy || 'Unknown'}
    </div>
  </div>
  ));

const About = () => (
  <div className="splash">
    <div className="splash__container">
      <div className="splash__header">
        <h2 className="splash__title">Credits</h2>
      </div>
      <div className="splash__instructions">
        <h3 className="splash__subhead">Artwork</h3>
        <h4 className="splash__bold">Superheroes:</h4>
        <div className="splash__list">
          {heroCredits}
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
