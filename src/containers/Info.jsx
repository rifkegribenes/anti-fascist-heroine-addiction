import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

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

const Info = props => (
  <div className="info">
    <h2 className="info__header">{props.header}</h2>
    <div className="info__subhead-wrap">
      <span className="info__subhead">Level:&nbsp;{props.gameLevel}</span>
    </div>
    <div className="info__container">
      <div className="info__col">
        <h3 className="info__hero-title">{props.hero.name || 'Hero'}</h3>
        <div className="card-pic-wrapper">
          <img src={props.hero.cardUrl} alt={props.hero.name} className="card-pic card-pic--round" id="hero" />
        </div>
        <div className="hero__stats">
          <div className="hero__aliases">Aliases: {props.hero.aliases}</div>
          <div className="hero__level">Level: {props.hero.level}</div>
          <div className="hero__attack">Attack: {props.hero.attack}</div>
          <div className="hero__powers">Powers: {props.hero.powers}</div>
          <div className="hero__xp">XP: {props.hero.xp}</div>
          <div className="hero__health">Health: {props.hero.hp}</div>
          <div className="hero__team">
            <h4 className="info__hero-title">Team</h4>
            <div className="hero__team--wrapper">
              {teamList(props.hero.team)}
            </div>
          </div>
        </div>
      </div>
      <div className="info__col">
        <h3 className="entity__title">{props.entity.type === 'food' ? props.entity.title : props.entity.name || ''}</h3>
        <div className="card-pic-wrapper">
          <img
            src={props.entity.cardUrl}
            alt={props.entity.type === 'food' ? props.entity.title : props.entity.name}
            className={props.entity.type === 'hero' || props.entity.type === 'teamHero' ? 'card-pic card-pic--round' : 'card-pic'}
            id="entity"
          />
        </div>
        <div className="entity__stats">
          {props.entity.aliases &&
          <div className="entity__aliases">Aliases: {props.entity.aliases}</div>
        }
          {props.entity.level &&
          <div className="entity__level">Level: {props.entity.level}</div>
        }
          {props.entity.damage &&
          <div className="entity__attack">Attack: {props.entity.damage}</div>
        }
          {props.entity.powers &&
          <div className="entity__bio">Powers: {props.entity.powers}</div>
        }
          {props.entity.message &&
          <div className="entity__message">{props.entity.message}</div>
        }
          {props.entity.health &&
          <div className="entity__health">Health: {props.entity.health}</div>
        }
          {props.entity.healthBoost &&
          <div className="entity__healthBoost">Health Boost: {props.entity.healthBoost}</div>
        }
        </div>
      </div>
    </div>
  </div>
);

Info.propTypes = {
  header: PropTypes.string,
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
    damage: PropTypes.number,
    bio: PropTypes.string,
    message: PropTypes.string,
    health: PropTypes.number,
    healthBoost: PropTypes.number,
  }),
};

Info.defaultProps = {
  hero: {},
  entity: {},
  header: '',
};

export default Info;
