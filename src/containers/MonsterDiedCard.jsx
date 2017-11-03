import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../store/actions';

class MonsterDiedCard extends React.Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="monster-card">
        <div className="">
          <img
            src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/you-died.png"
            alt="skull and crossbones"
          />
        </div>
        <div className="big-msg__body">{this.props.appState.bigMsg.body}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MonsterDiedCard);
