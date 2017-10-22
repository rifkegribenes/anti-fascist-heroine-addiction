import React from 'react';
import PropTypes from 'prop-types';

import { CSSTransitionGroup } from 'react-transition-group';

class HeroPicker extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
      active: this.props.active,
      direction: '',
    };
    this.rightClick = this.moveRight.bind(this);
    this.leftClick = this.moveLeft.bind(this);
	}

  generateItems() {
    let items = [];
    let level;
    for (let i = this.state.active - 2; i < this.state.active + 3; i++) {
      let index = i;
      if (i < 0) {
        index = this.state.items.length + i;
      } else if (i >= this.state.items.length) {
        index = i % this.state.items.length;
      }
      level = this.state.active - i;
      items.push(<Item key={index} id={this.state.items[index]} level={level} />);
  	}
    return items;
  }

  moveLeft() {
    let newActive = this.state.active;
    newActive--;
    this.setState({
      active: newActive < 0 ? this.state.items.length - 1 : newActive,
      direction: 'left',
    });
  }

  moveRight() {
    let newActive = this.state.active;
    this.setState({
      active: (newActive + 1) % this.state.items.length,
      direction: 'right',
    });
  }

  render() {
    return(
      <div id="carousel" className='carousel'>
      	<div className="carousel__wrap">
	      	<button className="modal__close" onClick={this.props.closeModal} aria-label="close">&times;</button>
	        <div className="arrow arrow-left" onClick={this.leftClick}><i className="fi-arrow-left"></i></div>
	        <CSSTransitionGroup
	          transitionName={this.state.direction}
	          transitionEnterTimeout={300}
	        	transitionLeaveTimeout={300}
	        	className="carousel__card-wrap">
	          {this.generateItems()}
	        </CSSTransitionGroup>
	        <div className="arrow arrow-right" onClick={this.rightClick}><i className="fi-arrow-right"></i></div>
	       </div>
      </div>
    )
  }
}

class Item extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      level: this.props.level
    };
  }

  render() {
    const className = 'item level' + this.props.level;
    return(
      <div className={className}>
      	<div className="carousel__card">
      		<h3 className="carousel__title">{this.props.id.name}</h3>
        	<div className="carousel__card-pic-wrapper">
          	<img src={this.props.id.cardUrl} alt={this.props.id.name} className="carousel__card-pic" />
        	</div>
        	<div className="carousel__stats">
        		<div className="carousel__aliases">Aliases: {this.props.id.aliases}</div>
	          <div className="carousel__powers">Powers: {this.props.id.message}</div>
        	</div>
      	</div>
      </div>
    )
  }
}

HeroPicker.propTypes = {
  heroes: PropTypes.array,
};

HeroPicker.defaultProps = {
  heroes: [],
};

export default HeroPicker;