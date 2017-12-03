import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../store/actions';
import SetDifficulty from './SetDifficulty';
import Sorry from './Sorry';

const Splash = props => (
  <div>
    {props.appState.modalType === 'difficulty' &&
      <SetDifficulty
        playSound={props.playSound}
        history={props.history}
      />
    }
    {props.appState.modalType === 'sorry' &&
      <Sorry
        playSound={props.playSound}
        history={props.history}
      />
    }
    <div className="splash">
      <div className="splash__container splash__container--narrow">
        <div className="splash__header">
          <h2 className="splash__title splash__title--wide">Anti-Fascist Heroine Addiction, the game</h2>
          <h3 className="splash__title splash__title--wide">Hanukkah Edition</h3>
          <div id="progress-wrap">
            <div id="progress" />
          </div>
        </div>
        <div className="splash__btn-wrap">
          <button
            className="big-msg__btn"
            onClick={() => {
              props.playSound('movement');
              props.history.push('/about');
            }}
          ><span className="rainbow">Credits</span></button>
          <button
            className="big-msg__btn"
            onClick={() => {
              props.playSound('movement');
              if (document.body.classList.contains('touchscreen') || window.innerWidth < 1000) {
                props.actions.openModal('sorry');
              } else {
                props.actions.openModal('difficulty');
              }
            }}
          ><span className="rainbow">Start Game</span></button>
        </div>
        <div className="splash__instructions">
          <h3 className="splash__subhead">How to Play</h3>
          <h4 className="splash__bold">Moving your character</h4>
            Use the arrow keys or W-A-S-D  to move through the grid.<br />
          <div className="splash__keys">
            <div className="splash__key-wrap">
              <span className="splash__key">&larr;</span>
              <span className="splash__key">&uarr;</span>
              <span className="splash__key">&rarr;</span>
              <span className="splash__key">&darr;</span>
            </div>
            <div className="splash__key-wrap">
              <span className="splash__key">A</span>
              <span className="splash__key">W</span>
              <span className="splash__key">S</span>
              <span className="splash__key">D</span>
            </div>
          </div>
          <h4 className="splash__bold">Health</h4>
          <div className="splash__key-wrap">
            <img className="splash__icon" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/ice-cream_32.png" alt="ice cream" />
            <img className="splash__icon" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/hamburger_32.png" alt="hamburger" />
            <img className="splash__icon" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/donut_32.png" alt="donut" />
            <img className="splash__icon" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/fries_32.png" alt="fries" />
          </div>
            Eat food you find in the grid to stay alive. It takes strength to
            fight monsters. Walk into a food to eat it.
          <h4 className="splash__bold">Your team</h4>
          <div className="splash__key-wrap">
            <img className="splash__icon--c" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/misty-knight_32_c.png" alt="misty knight" />
            <img className="splash__icon--c" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/wonder-woman_32_c.png" alt="wonder woman" />
            <img className="splash__icon--c" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/silk_32_c.png" alt="silk" />
            <img className="splash__icon--c" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/la-borinquena_32_c.png" alt="la borinqueña" />
          </div>
            Gather a team of superheroes to help you fight monsters. You
            can&rsquo;t do it alone! Each member of your team adds attack
            strength. Walk into a superhero to add her to your team.
          <h4 className="splash__bold">Monsters</h4>
          <div className="splash__key-wrap">
            <img className="splash__icon" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/bush_32.png" alt="george bush" />
            <img className="splash__icon" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/mcconnell_32.png" alt="mitch mcconnell" />
            <img className="splash__icon" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/cruz_32.png" alt="ted cruz" />
            <img className="splash__icon" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/reagan_32.png" alt="ronald reagan" />
          </div>
            Each monster your team defeats gives you experience points. It takes
            100 XP to level up. You&rsquo;ll need all the experience you can get
            to defeat the final monster. Walk into a monster repeatedly until
            you defeat it... or it defeats you!
          <h4 className="splash__bold">Staircases</h4>
          <img className="splash__icon--c" src="https://raw.githubusercontent.com/rifkegribenes/dungeon-crawler/master/src/img/staircase_32.png" alt="staircase" /> Staircases take you down to the next level of the dungeon. In &lsquo;Medium&rsquo; and &lsquo;Hard&rsquo; difficulty levels, staircases are hidden until your character has enough XP to level up.
          <h4 className="splash__bold">Winning the game</h4>
            To win, defeat the final monster on level 3.
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
