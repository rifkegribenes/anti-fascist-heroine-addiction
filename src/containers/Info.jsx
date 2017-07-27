import React from 'react';
import shortid from 'shortid';

const teamList = (obj) => {
    if (obj.length) {
      return obj.map(val => (
			<div className="hero-team__item" key={shortid.generate()}>
				<div className="hero-team__item--image"><img src={val.iconUrl} /></div>
				<div className="hero-team__item--attack">{val.damage}</div>
			</div>
		));
	} else {
		console.log('nothing in the list');
	}
}

const Info = (props) => (
  <div className="info-panel">
    <h2>{props.header}</h2>
    <h3 className="subhead">Game status</h3>
    <div className="level">Level: {props.gameLevel}</div>
    <h3 className="hero-title">{props.hero.name}</h3>
    <div className="card-pic-wrapper">
    	<img src={props.hero.cardUrl} className="card-pic"/>
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
    <h3 className="entity-title">{props.entity.type==='food' ? props.entity.title : props.entity.name}</h3>
    <div className="card-pic-wrapper">
    	<img src={props.entity.cardUrl} className="card-pic"/>
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

export default Info;
