import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

const teamList = (obj) => {
  if (obj.length) {
    return obj.map(val => (
      <div className="hero-team__item" key={shortid.generate()}>
        <div className="hero-team__item--image"><img src={val.iconUrl} alt={val.name} /></div>
        <div className="hero-team__item--attack">{val.damage}</div>
      </div>
      ));
  }
  return null;
};

const Info = props => (
  <div className="info-panel">
    <h2>{props.header}</h2>
    <h3 className="subhead">Game status</h3>
    <div className="level">Level: {props.gameLevel}</div>
    <h3 className="hero-title">{props.hero.name}</h3>
    <div className="card-pic-wrapper">
      <img src={props.hero.cardUrl} alt={props.hero.name} className="card-pic" />
    </div>
    <div className="hero-stats">
      <div className="hero-level">Level: {props.hero.level}</div>
      <div className="hero-attack">Attack: {props.hero.attack}</div>
      <div className="hero-bio">Bio: {props.hero.bio}</div>
      <div className="hero-xp">XP: {props.hero.xp}</div>
      <div className="hero-health">Health: {props.hero.hp}</div>
      <div className="hero-team">
        <h4>Team</h4>
        <div className="hero-team__wrapper">
          {teamList(props.hero.team)}
        </div>
      </div>
    </div>
    <h3 className="entity-title">{props.entity.type === 'food' ? props.entity.title : props.entity.name}</h3>
    <div className="card-pic-wrapper">
      <img src={props.entity.cardUrl} alt={props.entity.name} className="card-pic" />
    </div>
    <div className="entity-stats">
      {props.entity.level &&
      <div className="entity-level">Level: {props.entity.level}</div>
    }
      {props.entity.attack &&
      <div className="entity-attack">Attack: {props.entity.attack}</div>
    }
      {props.entity.bio &&
      <div className="entity-bio">Bio: {props.entity.bio}</div>
    }
      {props.entity.message &&
      <div className="entity-message">{props.entity.message}</div>
    }
      {props.entity.health &&
      <div className="entity-health">Health: {props.entity.health}</div>
    }
      {props.entity.healthBoost &&
      <div className="entity-healthBoost">Health Boost: {props.entity.healthBoost}</div>
    }
    </div>
  </div>
);

Info.propTypes = {
  header: PropTypes.string.isRequired,
  gameLevel: PropTypes.number.isRequired,
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
  entity: PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    cardUrl: PropTypes.string,
    level: PropTypes.number,
    attack: PropTypes.number,
    bio: PropTypes.string,
    message: PropTypes.string,
    health: PropTypes.number,
    healthBoost: PropTypes.number,
  }),
};

Info.defaultProps = {
  hero: {},
  entity: {},
};

export default Info;
