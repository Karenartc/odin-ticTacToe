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
    const player1 = Player(player1Name, 'X');
    const player2 = Player(player2Name || 'robot', 'O');
    console.log(player1.getName());
    console.log(player2.getName());
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

function DisplayController(){
    const startScreen = document.querySelector('#startScreen');
    const gameScreen = document.querySelector('#gameScreen');
    const board = document.querySelector('#gameBoard');
    const form = document.querySelector('#playerInput');
    const cantPlayer1Input = document.querySelector('#cantPlayer1');
    const cantPlayer2Input = document.querySelector('#cantPlayer2');
    const player2InputField = document.querySelector('#player2Field');
    const player1Input = document.querySelector('#player1');
    const player2Input = document.querySelector('#player2');

    let game;

    const handleStartGame = (e) => { 
        e.preventDefault();
        let player1Name = (player1Input.value).trim();
        let player2Name = (player2Input.value).trim();

        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        game = GameController(player1Name, player2Name);
        renderBoard();
    };

    const handleCantPlayers = () => {
        if(cantPlayer1Input.checked){
            player2InputField.classList.add('hidden');
            player2Input.value = '';
        }else if(cantPlayer2Input.checked){
            player2InputField.classList.remove('hidden');
        }
     };

    const renderBoard = () => {
        
     };

    form.addEventListener('submit', handleStartGame);
    cantPlayer1Input.addEventListener('change', handleCantPlayers);
    cantPlayer2Input.addEventListener('change', handleCantPlayers);
}

DisplayController();