import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import shortid from 'shortid';

import hearts from '../utils/helpers';
import * as Actions from '../store/actions';

const teamList = (obj) => {
  if (obj && obj.length) {
    return obj.map(val => (
      <div className="hero__team--item" key={shortid.generate()}>
        <div className="hero__team--item-image"><img src={val.iconUrl} alt={val.name} /></div>
      </div>
      ));
  }
  return null;
};

const InfoLeft = (props) => {
  let healthIndH = '';
  const heartsArrH = hearts(props.hero);

  // if hero health = 0, don't display any hearts
  if (heartsArrH.length) {
    healthIndH = heartsArrH.map(() => (
      <span className="info__heart-wrap" key={shortid.generate()}>
        <img className="info__heart" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/heart.png" alt="" /></span>
        ));
  }

  return (
    <div className="info">
      <h2 className="info__header">{props.header}</h2>
      <div className="info__container">
        <div className="info__col">
          <div className="info__col-wrap">
            <div className="info__hearts"><span className="info__heart-wrap">Health: {props.hero.hp}</span>{healthIndH}</div>
            <h3 className="info__hero-title">{props.hero.name || 'Hero'}</h3>
            <div className="hero__level" id="hero-level">Level {props.hero.level}</div>
            <div className="hero__xp">
              <span className="hero__xp-text">XP</span>
              <span className="hero__xp-slider" id="xp-slider" />
            </div>
            <div className="card-pic-wrapper">
              <img src={props.hero.cardUrl} alt={props.hero.name} className="card-pic card-pic--round" id="hero" />
            </div>
            <div className="hero__stats">
              <div className="hero__aliases">Aliases: {props.hero.aliases}</div>
              <div className="hero__powers">Powers: {props.hero.powers}</div>
              <div className="hero__team">
                <h4 className="info__hero-title info__hero-title--team">Your Team</h4>
                <div className="hero__attack">Total Team Attack: {props.hero.attack}
                </div>
                <div className="hero__team--wrapper">
                  {teamList(props.hero.team)}
                </div>
              </div>
              <button
                className="big-msg__btn"
                onClick={
                () => {
                  props.actions.restart();
                  props.history.push('/');
                }
                }
              >
              Restart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

InfoLeft.propTypes = {
  header: PropTypes.string,
  hero: PropTypes.shape({
    name: PropTypes.string,
    level: PropTypes.number,
    attack: PropTypes.number,
    bio: PropTypes.string,
    xp: PropTypes.number,
    hp: PropTypes.number,
    team: PropTypes.array,
    cardUrl: PropTypes.string,
  }),
};

InfoLeft.defaultProps = {
  hero: {},
  header: '',
};

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoLeft);
