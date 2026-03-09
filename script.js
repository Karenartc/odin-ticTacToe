function GameBoard(){
    let board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;

    const placeMark = (index, mark) => {
        if(board[index] === ''){
            board[index] = mark;
            return true;
        }else{
            return false;
        }
    }

    const resetGameBoard = () => board = ['', '', '', '', '', '', '', '', ''];

    return {getBoard, placeMark, resetGameBoard};
}

function Player(playerName, playerMark){
    const name = playerName;
    const mark = playerMark;

    const getName = () => name;
    const getMark = () => mark;

    return {getName, getMark};
}

function GameController(){
    const player1 = Player('player 1', 'X');
    const player2 = Player('player 2', 'O');
    const gameBoard = GameBoard();

    let currentPlayer = player1;
    let isGameOver = false;
    let winner = null;

    const getBoard = () => gameBoard.getBoard();

    const playTurn = (index) => {
        if(!isGameOver){
             let succes = gameBoard.placeMark(index, currentPlayer.getMark());
            if(succes) {
                let isWinner = checkWinner();

                if (isWinner){
                    winner = currentPlayer;
                    console.log(winner.getName());
                    isGameOver = true;

                } else{
                    let isTie = checkTie();

                    if(isTie){
                        console.log('tie');
                        isGameOver = true;
                        
                    } else {
                        currentPlayer = switchPlayer(currentPlayer);
                    }   
                }
                    
            };
        }
        
    }

    const switchPlayer = (player) => {
        return (player === player1) ? player2 : player1;
    };

    const checkWinner = () => {
        let currentBoard = gameBoard.getBoard();
        const winningMoves = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

        for(let i = 0; i < winningMoves.length; i++){
            let [first, second, third] = winningMoves[i];
            if(currentBoard[first] !== '' && (currentBoard[first] === currentBoard[second] && currentBoard[second] === currentBoard[third])){
                console.log([first, second, third]);
                return true;
            }             
        }

        return false;
    };

    const checkTie = () => {
        let currentBoard = gameBoard.getBoard();
        if(currentBoard.every(cell => cell !== '')){
            return true;
        } else {
            return false;
        }
    };
    
    const restart = () => {
        gameBoard.resetGameBoard();
        currentPlayer = player1;
        isGameOver = false;
        winner = null;
    };

    return {getBoard, playTurn, switchPlayer, checkWinner, checkTie, restart};
}

const game = GameController();
game.playTurn(0); // X
game.playTurn(1); // O
game.playTurn(2); // X
game.playTurn(5); // O
game.playTurn(3); // X
game.playTurn(4); // O
game.playTurn(7); // X
game.playTurn(6); // O
game.playTurn(8); // X
console.log(game.getBoard());

game.restart();
console.log(game.getBoard());