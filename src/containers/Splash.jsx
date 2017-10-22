import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../store/actions';
import Modal from 'react-modal';
import HeroPicker from './HeroPicker';

class Splash extends React.Component {
  render() {
    const modalStyles = { overlay: { zIndex: 1001, backgroundColor: 'rgba(0,0,0,.7)' } };
    return (
      <div>
        <Modal
          style={modalStyles}
          isOpen={this.props.appState.modalOpen}
          onRequestClose={this.props.actions.closeModal}
          className="modal"
          contentLabel="Choose player"
        >
          <HeroPicker
            items={this.props.appState.modalList}
            active={0}
            closeModal={this.props.actions.closeModal}
            setHero={this.props.actions.setHero}
          />
        </Modal>
        <h2>Splash</h2>
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

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
