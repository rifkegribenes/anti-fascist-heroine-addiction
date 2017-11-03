import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

import hearts from '../utils/helpers';

const InfoRight = (props) => {
  let healthIndM = '';
  const heartsArrM = hearts(props.entity);

  // if monster health = 0, don't display any hearts
  if (heartsArrM.length) {
    healthIndM = heartsArrM.map(() => {
      if (props.entity.type === 'monster' || props.entity.type === 'finalMonster') {
        return (
          <span className="info__heart-wrap" key={shortid.generate()}>
            <img className="info__heart" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/heart.png" alt="" /></span>
        );
      }
      return '';
    });
  }
  return (
    <div className="info">
      <h2 className="info__header">{props.header}</h2>
      <div className="info__container">
        <div className="info__col">
          <div className="info__col-wrap">
            <div className="info__hearts">
              {props.entity.type === 'monster' || props.entity.type === 'finalMonster' ?
                <span className="info__heart-wrap">Health: {props.entity.health}</span> :
                <span className="info__heart-wrap" />
            }{healthIndM}
            </div>
            {props.entity.type && props.entity.type !== 'floor' &&
            <h3 className={props.entity.type === 'monster' || props.entity.type === 'finalMonster' ? 'entity__title' : 'entity__title entity__title--margin'}>{props.entity.type === 'food' ? props.entity.title : props.entity.name || ''}</h3>
          }
            <div className="card-pic-wrapper">
              <img
                src={props.entity.health === 0 ? 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/you-died.png' : props.entity.cardUrl}
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
              {props.entity.bio &&
              <div className="entity__bio">{props.entity.bio}</div>
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

InfoRight.propTypes = {
  header: PropTypes.string,
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

InfoRight.defaultProps = {
  entity: {},
  header: '',
};

export default InfoRight;
