import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../store/actions';
import { trapFocus } from '../utils';

class SetDifficulty extends React.Component {

  componentDidMount() {
    document.getElementById('first').focus();
    trapFocus();
  }

  render() {
    return (
      <div className="modal__overlay">
        <div className="modal">
          <button
            id="first"
            className="modal__close aria-button"
            onClick={() => {
              console.log('close');
              this.props.playSound('movement');
              this.props.actions.closeModal();
            }}
          >&times;</button>
          <h2 className="modal__header">Choose difficulty</h2>
          <div className="modal__btn-wrap">
            <button
              className="big-msg__btn modal__btn"
              onClick={() => {
                this.props.playSound('movement');
                this.props.actions.closeModal();
                this.props.actions.setDifficulty(0);
                this.props.history.push('/hero-picker');
              }}
            ><span className="rainbow">Practice mode</span></button>
          </div>
          <div className="modal__btn-wrap">
            <button
              className="big-msg__btn modal__btn"
              onClick={() => {
                this.props.playSound('movement');
                this.props.actions.closeModal();
                this.props.actions.setDifficulty(1);
                this.props.history.push('/hero-picker');
              }}
            ><span className="rainbow">Easy</span></button>
            <button
              className="big-msg__btn modal__btn"
              onClick={() => {
                this.props.playSound('movement');
                this.props.actions.closeModal();
                this.props.actions.setDifficulty(2);
                this.props.history.push('/hero-picker');
              }}
            ><span className="rainbow">Medium</span></button>
            <button
              id="last"
              className="big-msg__btn modal__btn"
              onClick={() => {
                this.props.playSound('movement');
                this.props.actions.closeModal();
                this.props.actions.setDifficulty(3);
                this.props.history.push('/hero-picker');
              }}
            ><span className="rainbow">Hard</span></button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SetDifficulty);
