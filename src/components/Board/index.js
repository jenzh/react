import React,{ Component} from 'react';
import Square from '../Square';

class Board extends Component {

    renderSquare(i,j,box) {
      let index = i * box + j
      let lines = this.props.lines;
      let style = (lines.indexOf(index) === -1 ? 'square' : 'square green');
      return (
        <Square 
          key={"box-"+index}
          style={style}
          value={this.props.squares[index]} 
          onClick={() => this.props.onClick(i,j)} 
        />);
    }
  
    render() {
      const size = this.props.size;
      let row = Array(size).fill(null) //means 4x4
      return(
        <div>
          {row.map((_,i) => {
            return <div key={i} className="board-row">
            {row.map((_,j) => {
              return this.renderSquare(i,j,size);
            })}
            </div>
          })}
        </div>
      );
    }
  }

  export default Board;