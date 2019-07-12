import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import * as Actions from '../store/actions';

class Item extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      level: this.props.level,
    };
  }

  render() {
    const className = `item level${this.props.level}`;
    return (
      <button
        id={this.props.index}
        className={`${className} aria-button`}
        onClick={() => {
          this.props.playSound('startGame');
          this.props.actions.setHero(this.props.id);
          this.props.history.push('/play');
        }
        }
      >
        <div className="carousel__card">
          <h3 className="carousel__title">{this.props.id.name}</h3>
          <div className="carousel__card-pic-wrapper">
            <img src={this.props.id.cardUrl} alt={this.props.id.name} className="carousel__card-pic" />
          </div>
          <div className="carousel__stats">
            <div className="carousel__aliases">Aliases: {this.props.id.aliases}</div>
            <div className="carousel__powers">Powers: {this.props.id.powers}</div>
          </div>
        </div>
      </button>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions }, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Item));

