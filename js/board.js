import BoardSquare from './board-square.js';
import Bank from './bank.js';
import cookie from './cookie.js';

export default class Board {
    constructor(boardState = undefined) {
        this._bank = [...Bank];
        this._squares = [];
        this._cookieOptions = { expires: 7 }

        // Create board if no state is present
        if(!boardState) {
            this.generateNewBoard();
        } else {
            this.loadBoardFromHash(boardState);
        }
    }

    generateNewBoard() {
        let tempBank = [...Bank];

        for(let i = 0; i < 25; i++) {
            if(i !== 12) {      // Non-Free Space Squares
                let item = tempBank[Math.floor(Math.random() * tempBank.length)]
                tempBank = tempBank.filter(function(value) {
                    if(item !== value) {
                        return value;
                    }
                });

                this._squares.push(new BoardSquare(this._bank.indexOf(item), false, false));
            } else {           // Free Space
                this._squares.push(new BoardSquare(-1, true, true));
            }
        }

        cookie.set('boardState', this.generateBoardHash(), this._cookieOptions);
    }

    getBoardMarkup() {
        let boardMarkup = "<tr>";

        for(let i = 1; i < this._squares.length + 1; i++) {
            boardMarkup += this._squares[i - 1].toHtml();
            if(i % 5 === 0) {
                boardMarkup += "</tr><tr>"
            }
        }

        return boardMarkup + "</tr>";
    }

    generateBoardHash() {
        let boardState = btoa(JSON.stringify(this._squares));
        return boardState;
    }

    loadBoardFromHash(hash) {
        let deserializedBoardState = JSON.parse(atob(hash));
        for(let i = 0; i < deserializedBoardState.length; i++) {
            let boardSquare = new BoardSquare();
            Object.assign(boardSquare, deserializedBoardState[i]);
            deserializedBoardState[i] = boardSquare;
        }

        this._squares = deserializedBoardState;
    }

    updateSquareStates(squares) {
        for(let i = 0; i < squares.length; i++) {
            if(squares[i].classList.contains('square-stamped')) {
                this._squares[i].setStamped(true);
            } else {
                this._squares[i].setStamped(false);
            }
        }

        cookie.set('boardState', this.generateBoardHash(), this._cookieOptions);
    }

    getSquares() {
        return this._squares;
    }
}