function GameBoard(){
    let board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;

    const placeMark = (index, mark) => {
        console.log(`Index: ${index}`);
        console.log(`Mark: ${mark}`);

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
    
    const getBoard = () => gameBoard.getBoard();

    const playTurn = (index) => {

        let succes = gameBoard.placeMark(index, currentPlayer.getMark());
        if(succes){
            console.log(succes);
            currentPlayer = switchPlayer(currentPlayer);
            
        }
    }

    const switchPlayer = (player) => {
        if(player === player1){
            return player2;
        } else {
            return player1;
        }
    };

    const checkWinner = () => {};
    const checkTie = () => {};
    const restart = () => {};

    return {getBoard, playTurn, switchPlayer, checkWinner, checkTie, restart};
}

const game = GameController();
game.playTurn(0); 
game.playTurn(4);
game.playTurn(1); 
game.playTurn(5);
game.playTurn(2); 
console.log(game.getBoard());