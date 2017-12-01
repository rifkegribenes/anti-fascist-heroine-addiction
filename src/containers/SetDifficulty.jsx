import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../store/actions';

const SetDifficulty = props => (
  <div className="modal__overlay">
    <div className="modal">
      <button
        className="modal__close aria-button"
        onClick={() => {
          props.playSound('movement');
          props.actions.closeModal();
        }}
      >&times;</button>
      <h2 className="modal__header">Choose difficulty</h2>
      <div className="modal__btn-wrap">
        <button
          className="big-msg__btn modal__btn"
          onClick={() => {
            props.playSound('movement');
            props.actions.closeModal();
            props.actions.setDifficulty(0);
            props.history.push('/hero-picker');
          }}
        >Practice</button>
        <button
          className="big-msg__btn modal__btn"
          onClick={() => {
            props.playSound('movement');
            props.actions.closeModal();
            props.actions.setDifficulty(1);
            props.history.push('/hero-picker');
          }}
        >Easy</button>
        <button
          className="big-msg__btn modal__btn"
          onClick={() => {
            props.playSound('movement');
            props.actions.closeModal();
            props.actions.setDifficulty(2);
            props.history.push('/hero-picker');
          }}
        >Medium</button>
        <button
          className="big-msg__btn modal__btn"
          onClick={() => {
            props.playSound('movement');
            props.actions.closeModal();
            props.actions.setDifficulty(3);
            props.history.push('/hero-picker');
          }}
        >Hard</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(SetDifficulty);
