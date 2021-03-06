import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../store/actions';

const teamList = (arr) => {
  if (arr && arr.length) {
    return arr.map(val => (
      <div className="hero__team--item" key={val.name}>
        <div className="hero__team--item-image"><img src={val.iconUrl} alt={val.name} /></div>
      </div>
      ));
  }
  return null;
};

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
        <div className="big-msg__container">
          <h2 className="big-msg__title blink" id="msgTitle">{this.props.appState.bigMsg.title}</h2>
          <div className="big-msg__btn-wrap big-msg__btn-wrap--top">
            <a
              className="big-msg__btn big-msg__btn--icon"
              href="http://www.facebook.com/sharer.php?u=http://anti-fascist-heroine-addiction.surge.sh/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rainbow icon icon-facebook" />
            </a>
            <a
              className="big-msg__btn big-msg__btn--icon"
              href="https://twitter.com/share?url=http://anti-fascist-heroine-addiction.surge.sh/&text=Anti-Fascist%20Heroine%20Addiction%2C%20The%20Game%3A%20Chase%20Ted%20Cruz%27s%20disembodied%20head%20around%20the%20gameboard%20and%20punch%20it."
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rainbow icon icon-twitter" />
            </a>
            <a
              className="big-msg__btn big-msg__btn--icon"
              href="http://www.tumblr.com/share/link?url=http://anti-fascist-heroine-addiction.surge.sh/&name=Anti-Fascist%20Heroine%20Addiction%2C%20The%20Game&description=Chase%20Ted%20Cruz%27s%20disembodied%20head%20around%20the%20gameboard%20and%20punch%20it."
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rainbow icon icon-tumblr" />
            </a>
          </div>
          <div id="msgImg" className={this.props.appState.bigMsg.title === 'You won!' ? 'big-msg__img-wrap' : ''}>
            <img src={this.props.appState.bigMsg.imgUrl} className="big-msg__img" alt={this.props.appState.bigMsg.imgAlt} />
          </div>
          {this.props.appState.bigMsg.title === 'You won!' &&
            <div className="big-msg__team--wrapper">
              {teamList(this.props.appState.hero.team)}
            </div>
          }
          <div className="big-msg__news">{this.props.appState.bigMsg.news}</div>
          <div className="big-msg__body1">{this.props.appState.bigMsg.body1}</div>
          {this.props.appState.bigMsg.body2 &&
            <div className="big-msg__body2">{this.props.appState.bigMsg.body2}</div>
          }
          <button
            className="big-msg__btn big-msg__btn--wide"
            onClick={this.props.appState.bigMsg.action}
          >
            <span className="rainbow">{this.props.appState.bigMsg.actionText}</span>
          </button>
          <div className="big-msg__btn-wrap">
          Defeat these chucklef@cks in real life!
            <a
              className="big-msg__btn big-msg__btn--wide"
              href="https://www.vote.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rainbow">Register to vote</span>
            </a>
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

export default connect(mapStateToProps, mapDispatchToProps)(BigMsg);
