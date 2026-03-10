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

function GameController(player1Name, player2Name){
    const player1 = Player(player1Name, "X");
    const player2 = Player(player2Name ?? "robot", "O");
    const gameBoard = GameBoard();

    let currentPlayer = player1;
    let isGameOver = false;
    let winner = null;

    const getBoard = () => gameBoard.getBoard();
    const getCurrentPlayer = () => currentPlayer;
    const getWinner = () => winner;
    const getIsGameOver = () => isGameOver;

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

    return {getBoard, getCurrentPlayer, getIsGameOver, getWinner, playTurn, switchPlayer, checkWinner, checkTie, restart};
}