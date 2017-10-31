import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import * as Actions from '../store/actions';

const About = () => (
  <div className="splash">
    <div className="splash__container">
      <div className="splash__header">
        <h2 className="splash__title">Credits</h2>
      </div>
      <div className="splash__instructions">
        <h3 className="splash__subhead">How to Play</h3>
        <h4 className="splash__bold">Moving your character</h4>
          Blah blah blah.<br />
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
