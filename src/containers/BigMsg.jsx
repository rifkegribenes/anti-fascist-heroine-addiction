import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../store/actions';

class BigMsg extends React.Component {

  componentDidMount() {
    window.removeEventListener('keydown', this.props.handleKeydown);
    if (this.props.appState.bigMsg.title === 'You won!') {
      document.getElementById('msgTitle').classList.remove('blink');
      document.getElementById('msgTitle').classList.add('powerUp');
      setTimeout(() => {
        document.getElementById('msgImg').classList.add('big-msg__img--reveal');
      }, 200);
    }
  }

  render() {
    return (
      <div className="big-msg" style={this.props.style}>
        <h2 className="big-msg__title blink" id="msgTitle">{this.props.appState.bigMsg.title}</h2>
        <div id="msgImg" className={this.props.appState.bigMsg.title === 'You won!' ? 'big-msg__img-wrap' : ''}>
          <img src={this.props.appState.bigMsg.imgUrl} className="big-msg__img" alt={this.props.appState.bigMsg.imgAlt} />
        </div>
        <div className="big-msg__body">{this.props.appState.bigMsg.body}</div>
        <button className="big-msg__btn" onClick={this.props.appState.bigMsg.action}>{this.props.appState.bigMsg.actionText}</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(BigMsg);
