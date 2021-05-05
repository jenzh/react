import React, {Component} from 'react';
import Board from '../Board';
import './index.css'

//
function calculateWinner(squares) {

  let len = Math.sqrt(squares.length);
  let winner = null;
  let lines = Array(len).fill(null);
  //rows
  for (let i = 0; i < len; i++) {
    winner = squares[i*len]
    lines[0] = i*len;
    for (let j = 1; j < len; j++) {
      if( !winner || squares[i*len+j] !== winner) {
        winner = null;
        break;
      }
      lines[j] = i*len+j;
    }
    if(winner) return {winner:winner,lines:lines};
  }
  //columns
  for (let i = 0; i < len; i++) {
    winner = squares[i]
    lines[0] = i;
    for (let j = 1; j < len; j ++) {
      if(!winner || squares[j*len+i] !== winner) {
        winner = null;
        break;
      }
      lines[j] = j*len + i;
    }
    if(winner) return {winner:winner,lines:lines};
  }
  //
  winner = squares[0 * len + 0]
  lines[0] = 0;
  for (let i = 1; i < len; i++) {
      if(!winner || squares[i * len + i] !== winner) {
        winner = null;
        break;
      } 
      lines[i] = i * len + i;
  }
  if(winner) return {winner:winner,lines:lines};

  winner = squares[0 * len + len - 1]
  lines[0] = len - 1;
  for (let i = 1; i < len; i++) {
      if( !winner || squares[i * len + len - 1 - i] !== winner) {
        winner = null;
        break;
      } 
      lines[i] = i * len + len - 1 - i;
  }
  if(winner) return {winner:winner,lines:lines};
}

//
function finished(squares) {
  let finished = true;
  squares.forEach((item,index) => {
    if( !item ) finished = false;
  })
  return finished;
}

class Game extends Component {

    constructor(props) {
      super(props);
      this.size = 6   //container size
      this.state = {
        history: [{
          squares: Array(this.size*this.size).fill(null),
          locate: null
        }],
        stepNumber: 0,
        xIsNext: true,
        listOrder: false,
        lines: []
      }
    }
  
    handleClick(i,j) {
      
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
  
      const box = Math.sqrt(squares.length);
  
      let index = i * box + j
      
      
      let winnerObj = calculateWinner(squares);
      if(winnerObj || squares[index]) {
        return false;
      }
      
      squares[index] = this.state.xIsNext ? 'X' : 'O';
      winnerObj = calculateWinner(squares);
      //if(winnerObj && winnerObj.winner) return false;
      this.setState({
        history: history.concat([{
          squares: squares,
          locate: i+','+j
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        ListReserse: false,
        lines: (winnerObj ? winnerObj.lines : [])
      });
    }
  
    //
    jumpTo(step) {
      
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
        lines: []
      });
  
    }

    /**
     * @function 修改用于判断历史记录正序/逆序显示的参数descendingOrder
     **/
    reverseHistory() {
      const { listOrder }  = this.state;
      this.setState({
        listOrder: !listOrder
      });
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winnerObj = calculateWinner(current.squares);
      const listOrder = this.state.listOrder;
  
      let status;
      if(winnerObj) {
        status = "## 胜利方: " + winnerObj.winner
      } else {
        if(finished(current.squares)) {
          status = "## 本次平局 ##";
        } else {
          status = "## 本轮落子: "+ (this.state.xIsNext ? 'X' : 'O');
        }
      }
      
      const moves = history.map((step,move) => {
        const desc = move ? 
          '回到第' + move.toString().padStart(2,'0') + '步，落点('+step.locate+')' :
          '重新开启';
        if( move === this.state.stepNumber) {
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

      if(listOrder) { moves.reverse(); }
      
      return(
        <div className="game">
        <div className="game-board">
          <Board squares={current.squares} size={this.size} lines={this.state.lines} onClick={(i,j)=>this.handleClick(i,j)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div> <button onClick={()=>this.reverseHistory()}>{listOrder ? '升序排列':'降序排列'}</button></div>
          <ol>{moves}</ol>
          
        </div>
      </div>
      );
    }
  }

  export default Game;
  
 