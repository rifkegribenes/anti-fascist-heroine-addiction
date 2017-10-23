import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';

import * as Actions from '../store/actions';
import HeroPicker from './HeroPicker';

const modalStyles = { overlay: { zIndex: 1001, backgroundColor: 'rgba(0,0,0,.7)' } };

const Splash = props => (
  <div>
    <Modal
      style={modalStyles}
      isOpen={props.appState.modalOpen}
      onRequestClose={props.actions.closeModal}
      className="modal"
      contentLabel="Choose player"
    >
      <HeroPicker
        items={props.appState.modalList}
        active={0}
        closeModal={props.actions.closeModal}
        setHero={props.actions.setHero}
      />
    </Modal>
    <h2>Splash</h2>
  </div>
    );

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
