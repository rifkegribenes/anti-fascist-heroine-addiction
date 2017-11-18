import React from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

// import * as Actions from '../store/actions';

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
    if (this.props.title === 'You won!') {
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
          <h2 className="big-msg__title blink" id="msgTitle">{this.props.title}</h2>
          <div id="msgImg" className={this.props.title === 'You won!' ? 'big-msg__img-wrap' : ''}>
            <img src={this.props.imgUrl} className="big-msg__img" alt={this.props.imgAlt} />
          </div>
          {this.props.title === 'You won!' &&
            <div className="big-msg__team--wrapper">
              {teamList(this.props.team)}
            </div>
          }
          <div className="big-msg__news">{this.props.news}</div>
          <div className="big-msg__body1">{this.props.body1}</div>
          {this.props.body2 &&
            <div className="big-msg__body2">{this.props.body2}</div>
          }
          <button
            className="big-msg__btn"
            onClick={this.props.action}
          >
            {this.props.actionText}
          </button>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//   appState: state.appState,
// });

// const mapDispatchToProps = dispatch => ({
//   actions: bindActionCreators({ ...Actions }, dispatch),
// });

export default BigMsg;
