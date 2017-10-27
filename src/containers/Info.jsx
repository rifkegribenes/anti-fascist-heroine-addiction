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

const hearts = (entity) => {
  let totalHealth;
  let healthNum;
  if (entity.type === 'hero') {
    const healthArray = [160, 280, 510];
    totalHealth = healthArray[entity.level - 1];
    healthNum = Math.floor((entity.hp / totalHealth) * 5) + 1;
  } else if (entity.type === 'monster') {
    const healthArray = [70, 243, 515];
    totalHealth = healthArray[entity.level - 1];
    healthNum = Math.floor((entity.health / totalHealth) * 5) + 1;
  } else if (entity.type === 'finalMonster') {
    totalHealth = 500;
    healthNum = Math.floor((entity.health / totalHealth) * 5) + 1;
  }
  const heartsArr = [];
  for (let i = 0; i < healthNum; i++) {
    heartsArr.push('0');
  }
  return heartsArr;
};

const Info = (props) => {
  const healthIndH = hearts(props.hero).map(() => (
    <span className="info__heart-wrap" key={shortid.generate()}>
      <img className="info__heart" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/heart.png" alt="" /></span>
      ));
  const healthIndM = hearts(props.entity).map(() => {
    if (props.entity.type === 'monster' || props.entity.type === 'finalMonster') {
      return (
        <span className="info__heart-wrap" key={shortid.generate()}>
          <img className="info__heart" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/heart.png" alt="" /></span>
      );
    }
    return '';
  });
  return (
    <div className="info">
      <h2 className="info__header">{props.header}</h2>
      <div className="info__subhead-wrap">
        <span className="info__subhead">Level:&nbsp;{props.gameLevel}</span>
      </div>
      <div className="info__container">
        <div className="info__col">
          <div className="info__col-wrap">
            <div className="info__hearts"><span className="info__heart-wrap">Health: {props.hero.hp}</span>{healthIndH}</div>
            <h3 className="info__hero-title">{props.hero.name || 'Hero'}</h3>
            <div className="card-pic-wrapper">
              <img src={props.hero.cardUrl} alt={props.hero.name} className="card-pic card-pic--round" id="hero" />
            </div>
            <div className="hero__stats">
              <div className="hero__aliases">Aliases: {props.hero.aliases}</div>
              <div className="hero__level">XP: {props.hero.xp} &bull; Level: {props.hero.level}</div>
              <div className="hero__attack">Attack: {props.hero.attack}</div>
              <div className="hero__powers">Powers: {props.hero.powers}</div>
              <div className="hero__team">
                <h4 className="info__hero-title">Team</h4>
                <div className="hero__team--wrapper">
                  {teamList(props.hero.team)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="info__col">
          <div className="info__col-wrap">
            <div className="info__hearts">
              {props.entity.type === 'monster' ?
                <span className="info__heart-wrap">Health: {props.entity.health}</span> :
                <span className="info__heart-wrap" />
            }{healthIndM}
            </div>
            {props.entity.type && props.entity.type !== 'floor' &&
            <h3 className={props.entity.type === 'monster' ? 'entity__title' : 'entity__title entity__title--margin'}>{props.entity.type === 'food' ? props.entity.title : props.entity.name || ''}</h3>
          }
            <div className="card-pic-wrapper">
              <img
                src={props.entity.cardUrl}
                alt={props.entity.type === 'food' ? props.entity.title : props.entity.name}
                className={props.entity.type === 'hero' || props.entity.type === 'teamHero' || props.entity.type === 'staircase' ? 'card-pic card-pic--round' : 'card-pic'}
                id="entity"
              />
            </div>
            <div className="hero__stats">
              {props.entity.aliases &&
              <div className="hero__aliases">Aliases: {props.entity.aliases}</div>
            }
              {props.entity.level &&
              (props.entity.type === 'teamHero' ||
                props.entity.type === 'monster' ||
                props.entity.type === 'finalMonster') &&
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
              {props.entity.healthBoost &&
              <div className="entity__healthBoost">Health Boost: {props.entity.healthBoost}</div>
            }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
