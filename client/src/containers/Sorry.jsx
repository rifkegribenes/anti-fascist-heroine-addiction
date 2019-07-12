import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../store/actions';
import { trapFocus } from '../utils';

class Sorry extends React.Component {

  componentDidMount() {
    document.getElementById('first').focus();
    trapFocus();
  }

  render() {
    return (
      <div className="modal__overlay">
        <div className="modal modal__full">
          <div className="modal__header--wrap">
            <h2 className="modal__header modal__header--big rainbow">Sorry </h2>
            <span className="modal__header modal__header--big modal__header--span rainbow">:(</span>
          </div>
          <div className="splash__instructions">
          This game works best on screens wider than 1000px with a keyboard
           attached. Come back later when you&rsquo;re at a laptop or desktop, OK?
          </div>
          <div className="modal__btn-wrap">
            <button
              id="first"
              className="btn__small modal__btn"
              onClick={() => {
                this.props.playSound('movement');
                this.props.actions.closeModal();
                this.props.history.push('/');
              }}
            >OK cool</button>
          </div>
          <div className="modal__btn-wrap">
            <button
              id="last"
              className="btn__small modal__btn"
              onClick={() => {
                this.props.playSound('movement');
                this.props.actions.closeModal();
                this.props.actions.openModal('difficulty');
              }}
            >No! I want to play anyway even though I will have a shitty user
             experience and the game does not work at all without a keyboard!
             You&rsquo;re not the boss of me!</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Sorry);
