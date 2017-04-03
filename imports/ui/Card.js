import React, {Component} from 'react';
import _ from 'lodash';

export default class Card extends Component {
  constructor(props) {
    super(props);
  }

  handleClick(event) {
    this.props.handleClickCb(this.props.id);
  }

  render() {
    return (
      <div className="col s3">
        <div style={{transform: `rotate(${this.props.rotation}deg)`}}
          className={`card card-${ this.props.color } card-${ this.props.number } ${ this.props.selected ? "selected" : "" }`}
          onClick={this.handleClick.bind(this)}>

          {_.times(this.props.number, (i) =>
            <i key={i} className={`fa ${ this.iconFor(this.props.shape, this.props.fill) } fa-5x`}></i>
          )}
        </div>
      </div>
    );
  }

  iconFor(shape, fill) {
    if (shape == "battery") {
      return {
        "empty": "fa-battery-empty",
        "half": "fa-battery-half",
        "full": "fa-battery-full"
      }[fill];
    } else if (shape == "star") {
      return {
        "empty": "fa-star-o",
        "half": "fa-star-half-o",
        "full": "fa-star"
      }[fill];
    } else {
      return {
        "empty": "fa-circle-o",
        "half": "fa-dot-circle-o",
        "full": "fa-circle"
      }[fill];
    }
  }
}
