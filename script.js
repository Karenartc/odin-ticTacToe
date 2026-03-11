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
    const gameBoard = GameBoard();

    let currentPlayer = player1;
    let isGameOver = false;
    let winner = null;

    const getBoard = () => gameBoard.getBoard();
    const getCurrentPlayer = () => currentPlayer;
    const getWinner = () => winner;
    const getIsGameOver = () => isGameOver;
    const getIsTie = () => checkTie();

    const isRobotGame = () => player2.getName().toLowerCase() === 'robot';

    const getAvailableMoves = () => {
        const currentBoard = gameBoard.getBoard();
        return currentBoard
            .map((cell, index) => cell === '' ? index : null)
            .filter(index => index !== null);
    };

    const playTurn = (index) => {
        if(!isGameOver){
             let succes = gameBoard.placeMark(index, currentPlayer.getMark());
            if(succes) {
                let isWinner = checkWinner();

                if (isWinner){
                    winner = currentPlayer;
                    isGameOver = true;

                } else{
                    let isTie = checkTie();

                    if(isTie){
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

    return {
        getBoard, 
        getCurrentPlayer, 
        getIsGameOver, 
        getWinner, 
        getIsTie,
        isRobotGame,
        getAvailableMoves,
        playTurn, 
        switchPlayer, 
        checkWinner, 
        checkTie, 
        restart};
}

function DisplayController(){
    const startScreen = document.querySelector('#startScreen');
    const form = document.querySelector('#playerInput');
    const cantPlayer1Input = document.querySelector('#cantPlayer1');
    const cantPlayer2Input = document.querySelector('#cantPlayer2');
    const player2InputField = document.querySelector('#player2Field');
    const player1Input = document.querySelector('#player1');
    const player2Input = document.querySelector('#player2');
    
    const gameScreen = document.querySelector('#gameScreen');
    const playerTurnMessage = document.querySelector('#turnMessage');
    const player1NameDisplay = document.querySelector('#player1Name');
    const player2NameDisplay = document.querySelector('#player2Name');

    const board = document.querySelector('#gameBoard');

    const modal = document.querySelector('#winnerModal');
    const modalMessage = document.querySelector('#winnerMessage');
    const modalBtn = document.querySelector('#playAgainBtn');

    let game;

    const handleStartGame = (e) => { 
        e.preventDefault();
        let player1Name = (player1Input.value).trim();
        let player2Name = (player2Input.value).trim();

        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        game = GameController(player1Name, player2Name);
        renderPlayerNames(player1Name, player2Name);
        renderTurn();
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
        let theBoardGame = game.getBoard();
        board.innerHTML = '';

        theBoardGame.forEach((cellValue, cellIndex) => {
            let cellDiv = document.createElement('div');
            cellDiv.classList.add('game-cell');
            cellDiv.dataset.index = cellIndex;
            board.appendChild(cellDiv);
            cellDiv.textContent = cellValue;

            cellDiv.addEventListener('click', () => handleCellClick(cellIndex));
        });
    };

    const renderPlayerNames = (player1Name, player2Name) => {
        player1NameDisplay.textContent = player1Name;
        player2NameDisplay.textContent = player2Name || 'Robot';
    }

    const renderTurn = () => {
        let currentPlayerName = game.getCurrentPlayer().getName();
        playerTurnMessage.textContent = currentPlayerName + "'s turn";
    }

    const updateGameStateUI = () => {
        if (game.getIsGameOver()) {
            modal.classList.remove('hidden');

            if (game.getWinner()) {
                modalMessage.textContent = game.getWinner().getName() + ' Won!';
            } else {
                modalMessage.textContent = "It's a Tie!";
            }

            return true;
        }

        renderTurn();
        return false;   
    };

    const handleCellClick = (clickIndex) => {
        game.playTurn(clickIndex);
        renderBoard();

        const gameFinished = updateGameStateUI();
        if (gameFinished) return;

        if (game.isRobotGame() && game.getCurrentPlayer().getName().toLowerCase() === 'robot') {
            setTimeout(handleRobotMove, 400);
        }
    };

    const handleModalBtn = () => {
        modal.classList.add('hidden');
        game.restart();
        renderBoard();
        renderTurn()
    }

    const handleRobotMove = () => {
        if (!game.isRobotGame()) return;
        if (game.getIsGameOver()) return;
        if (game.getCurrentPlayer().getName().toLowerCase() !== 'robot') return;

        const availableMoves = game.getAvailableMoves();
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const robotMove = availableMoves[randomIndex];

        game.playTurn(robotMove);
        renderBoard();
        updateGameStateUI();
    };

    form.addEventListener('submit', handleStartGame);
    cantPlayer1Input.addEventListener('change', handleCantPlayers);
    cantPlayer2Input.addEventListener('change', handleCantPlayers);
    modalBtn.addEventListener('click', handleModalBtn);
}

DisplayController();