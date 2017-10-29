import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../store/actions';

const BigMsg = props => (
  <div className="big-msg" style={props.style}>
    <h2 className="big-msg__title blink">{props.appState.bigMsg.title}</h2>
    <img className="big-msg__img" src={props.appState.bigMsg.imgUrl} alt={props.appState.bigMsg.imgAlt} />
    <div className="big-msg__body">{props.appState.bigMsg.body}</div>
    <button className="big-msg__btn" onClick={props.appState.bigMsg.action}>{props.appState.bigMsg.actionText}</button>
  </div>
    );

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BigMsg);
