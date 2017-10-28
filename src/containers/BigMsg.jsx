import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../store/actions';

const BigMsg = props => (
  <div className="big-msg">
    <h2 className="big-msg__title">{props.title}</h2>
    <img className="big-msg__img" src={props.imgUrl} alt={props.imgAlt}/>
    <div className="big-msg__body">{props.body}</div>
    <button className="big-msg__btn" onClick={props.action}>{props.actionText}</button>
  </div>
    );

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BigMsg);