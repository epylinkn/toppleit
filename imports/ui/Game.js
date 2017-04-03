import React, {Component} from 'react';
import _ from 'lodash';
import Card from './Card.js';

export default class Game extends Component {
  constructor(props) {
    super(props);

    var deck = this.createDeck();
    this.state = {
      deck: _.takeRight(deck, 81-12),
      board: _.take(deck, 12),
      selected: [],
      status: '',
      wrong_count: 0,
      correct_count: 0
    }

    console.log("BOARD", this.state.board);
  }

  createDeck() {
    const colors = ["cyan", "magenta", "yellow"];
    const numbers = [1, 2, 3];
    const shapes = ["star", "circle", "battery"];
    const fills =  ["empty", "half", "full"];

    var cards = [];
    _.each(colors, (color) => {
      _.each(numbers, (number) => {
        _.each(shapes, (shape) => {
          _.each(fills, (fill) => {
            cards.push({
              id: cards.length,
              color: color,
              number: number,
              shape: shape,
              fill: fill,
              rotation: _.sample([-2, -1, 0, 1, 2])
            })
          })
        })
      })
    })

    return _.shuffle(cards);
  }

  handleClick(id) {
    // Don't allow selecting same card
    const pos = this.state.selected.indexOf(id);
    if (pos !== -1) {
      var selected = this.state.selected;
      selected.splice(pos, 1);
      this.setState({
        selected: selected
      })
      return false;
    }

    this.setState({
      selected: this.state.selected.concat(id)
    });
  }


  render() {
    return (
      <div className="container">
        <div>
          <h1 style={{textAlign: "center"}}>{this.state.deck.length} cards remaining</h1>
          {this.state.wrong_count > 2 &&
            <h5 style={{textAlign: "center"}}>UGH, GET BETTER KENNETH...</h5>
          }
        </div>

        <div className="row buttons">
          <div className="tools tools-wrong-sets">{this.state.wrong_count}</div>

          <div className="tools tools-add-card">
            <a className="btn-floating btn-large waves-effect waves-light red"
                onClick={this.addCard.bind(this)}>
              <i className="fa fa-plus fa-3x"></i>
            </a>
          </div>

          <div className="tools tools-correct-sets">{this.state.correct_count}</div>
        </div>

        <div className="row">
          <div className={this.state.status}>
          {this.state.board.map((card, i) =>
            <Card key={i}
            id={card.id}
            handleClickCb={this.handleClick.bind(this)}
            selected={this.state.selected.indexOf(card.id) !== -1}
            color={card.color}
            number={card.number}
            shape={card.shape}
            fill={card.fill}
            rotation={card.rotation}
            />
          )}
          </div>
        </div>
      </div>
    );
  }

  addCard() {
    this.setState((prevState) => {
      return {
        deck: prevState.deck.slice(1),
        board: prevState.board.concat(prevState.deck[0])
      }
    })
  }

  componentDidUpdate() {
    console.log(this.state.selected);
    if (this.state.status == '' && this.state.selected.length >= 3) {
      var cards = this.state.board.filter((card) => { return this.state.selected.indexOf(card.id) !== -1 });
      if (this.isValidSet(cards)) {
        console.log("yep");
        var numCards = _.max([0, 3 - (this.state.board.length - 12)]);
        var nextCards = this.state.deck.slice(0, numCards);
        var nextBoard = this.state.board.map((card) => {
          if (this.state.selected.indexOf(card.id) == -1) {
            return card;
          } else {
            const nextCard = nextCards.pop();
            if (nextCard) {
              return nextCard;
            } else {
              return null;
            }
          }
        })
        var nextBoard = _.compact(nextBoard);

        this.setState({
          status: "correct",
          correct_count: this.state.correct_count + 1
        });

        setTimeout(() => {
          this.setState({
            selected: [],
            board: nextBoard,
            deck: this.state.deck.slice(numCards),
            status: ""
          })
        }, 1000)
      } else {
        this.setState({
          status: "wrong",
          wrong_count: this.state.wrong_count + 1
        });

        setTimeout(() => {
          console.log("nope");
          this.setState({
            selected: [],
            status: ""
          });
        }, 1000)
      }
    }
  }

  isValidSet(cards) {
    return _.every([
      _.uniq(_.map(cards, "color")),
      _.uniq(_.map(cards, "number")),
      _.uniq(_.map(cards, "shape")),
      _.uniq(_.map(cards, "fill"))
    ], (attrs) => {
      return attrs.length == 1 || attrs.length == 3;
    })
  }
}
