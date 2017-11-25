import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import hearts from '../utils/helpers';
import * as Actions from '../store/actions';

class InfoRight extends React.Component {

  componentDidUpdate(prevProps) {
    if (prevProps.appState.currentEntity.type !== this.props.appState.currentEntity.type) {
      // console.log(`prevEntity: ${prevProps.appState.currentEntity.type}`);
      // console.log(`currEntity: ${this.props.appState.currentEntity.type}`);
    }
  }

  render() {
    let healthIndM = '';
    const heartsArrM = hearts(this.props.appState.currentEntity);

    // if monster health = 0, don't display any hearts
    if (heartsArrM.length) {
      healthIndM = heartsArrM.map(() => {
        if (this.props.appState.currentEntity.type === 'monster' || this.props.appState.currentEntity.type === 'finalMonster') {
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
        <h2 className="info__header">{this.props.header}</h2>
        <div className="info__container">
          <div className="info__col">
            <div className="info__col-wrap">
              <div className="info__hearts">
                {this.props.appState.currentEntity.type === 'monster' || this.props.appState.currentEntity.type === 'finalMonster' ?
                  <span className="info__heart-wrap">Health: {this.props.appState.currentEntity.health}</span> :
                  <span className="info__heart-wrap" />
              }{healthIndM}
              </div>
              {this.props.appState.currentEntity.type && this.props.appState.currentEntity.type !== 'floor' &&
                <h3 className={this.props.appState.currentEntity.type === 'monster' || this.props.appState.currentEntity.type === 'finalMonster' ? 'entity__title' : 'entity__title entity__title--margin'}>{this.props.appState.currentEntity.type === 'food' ? this.props.appState.currentEntity.title : this.props.appState.currentEntity.name || ''}</h3>
              }
              <div className="card-pic-wrapper">
                <img
                  src={this.props.appState.currentEntity.health === 0 ? 'https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/you-died.png' : this.props.appState.currentEntity.cardUrl}
                  alt={this.props.appState.currentEntity.type === 'food' ? this.props.appState.currentEntity.title : this.props.appState.currentEntity.name}
                  className={this.props.appState.currentEntity.type === 'hero' || this.props.appState.currentEntity.type === 'teamHero' || this.props.appState.currentEntity.type === 'staircase' ? 'card-pic card-pic--round' : 'card-pic'}
                  id="entity"
                />
              </div>
              <div className="hero__stats">
                {this.props.appState.currentEntity.aliases &&
                <div className="hero__aliases">Aliases: {this.props.appState.currentEntity.aliases}</div>
              }
                {this.props.appState.currentEntity.damage &&
                <div className="entity__attack">Attack: {this.props.appState.currentEntity.damage}</div>
              }
                {this.props.appState.currentEntity.powers &&
                <div className="entity__bio">Powers: {this.props.appState.currentEntity.powers}</div>
              }
                {this.props.appState.currentEntity.bio &&
                <div className="entity__bio">{this.props.appState.currentEntity.bio}</div>
              }
                {this.props.appState.currentEntity.healthBoost &&
                <div className="entity__healthBoost">Health Boost: {this.props.appState.currentEntity.healthBoost}</div>
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

InfoRight.propTypes = {
  header: PropTypes.string,
  appState: PropTypes.shape({
    currentEntity: PropTypes.shape({
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
  }).isRequired,
};

InfoRight.defaultProps = {
  header: '',
};

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoRight);
