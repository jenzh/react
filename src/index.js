import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {

  renderSquare(i,j,box) {
    
    let index = i * box + j
    return (
      <Square 
        key={"box-"+index}
        value={this.props.squares[index]} 
        onClick={() => this.props.onClick(i,j)} 
      />);
  }

  render() {
    const len = Math.sqrt(this.props.squares.length);
    let row = Array(len).fill(null) //means 4x4
    return(
      <div>
        {row.map((v,i) => {
          return <div key={i} className="board-row">
          {row.map((v,j) => {
            return this.renderSquare(i,j,len);
          })}
          </div>
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(16).fill(null),
        locate: null
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i,j) {
    
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const box = Math.sqrt(squares.length);

    let index = i * box + j
    //calculateWinner(squares) ||
    if(squares[index]) {
      return false;
    }
    squares[index] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares:squares,
        locate:i+','+j
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      
    });

    console.debug(this.state);
  }

  jumpTo(step) {
    
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });

  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if(winner) {
      status = "## 胜利方: "+winner
    } else {
      if(finished(current.squares)) {
        status = "## 本次平局 ##";
      } else {
        status = "## 本轮落子: "+ (this.state.xIsNext ? '甲' : '乙');
      }
    }

    const moves = history.map((step,move) => {
      const desc = move ? 
        '回到第' + move + '步，落点('+step.locate+')' :
        '重新开启';
      if( move == this.state.stepNumber) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
    });

    return(
      <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i,j)=>this.handleClick(i,j)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
        <div><button>升序</button> <button>降序</button></div>
      </div>
    </div>
    );
  }
}


function calculateWinner(squares) {
  
  const lines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10,11],
    [12,13,14,15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10,14],
    [3, 7, 11,15],
    [0, 5, 10,15],
    [3, 6, 9, 12]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[d] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function finished(squares) {
  let finished = true;
  squares.map((item,index) => {
    if( !item ) finished = false;
  })
  return finished;
}

ReactDOM.render(<Game />, document.getElementById("root"));