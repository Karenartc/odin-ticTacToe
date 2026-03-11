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
    const player2NameDisplay = document.querySelector('#player2Name');
    const player1ScoreDisplay = document.querySelector('#player1Score');
    const player1NameDisplay = document.querySelector('#player1Name');
    const player2ScoreDisplay = document.querySelector('#player2Score');

    const board = document.querySelector('#gameBoard');

    const modal = document.querySelector('#winnerModal');
    const modalMessage = document.querySelector('#winnerMessage');
    const modalBtn = document.querySelector('#playAgainBtn');

    let player1Score = 0;
    let player2Score = 0;
    const maxScore = 3;

    let game;

    const handleStartGame = (e) => { 
        e.preventDefault();
        let player1Name = (player1Input.value).trim();
        let player2Name = (player2Input.value).trim();

        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        game = GameController(player1Name, player2Name);
        renderPlayerNames(player1Name, player2Name);
        renderScores();
        renderTurn();
        renderBoard();
    };

    const handleCantPlayers = () => {
        if(cantPlayer1Input.checked){
            player2InputField.classList.add('hidden');
            player2Input.value = '';
        } else if(cantPlayer2Input.checked){
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
            cellDiv.textContent = cellValue;

            cellDiv.addEventListener('click', () => handleCellClick(cellIndex));
            board.appendChild(cellDiv);
        });
    };

    const renderPlayerNames = (player1Name, player2Name) => {
        player1NameDisplay.textContent = player1Name || 'Player 1';
        player2NameDisplay.textContent = player2Name || 'Robot';
    };

    const renderScores = () => {
        player1ScoreDisplay.textContent = player1Score;
        player2ScoreDisplay.textContent = player2Score;
    };

    const renderTurn = () => {
        let currentPlayerName = game.getCurrentPlayer().getName();
        playerTurnMessage.textContent = currentPlayerName + "'s turn";
    };

    const updateScore = (winnerName) => {
        if (winnerName === player1NameDisplay.textContent) {
            player1Score++;
        } else if (winnerName === player2NameDisplay.textContent) {
            player2Score++;
        }
    };

    const hasMatchWinner = () => {
        return player1Score === maxScore || player2Score === maxScore;
    };

    const resetRound = () => {
        game.restart();
        renderBoard();
        renderTurn();
    };

    const resetMatch = () => {
        player1Score = 0;
        player2Score = 0;
        renderScores();

        modal.classList.add('hidden');
        game.restart();
        renderBoard();
        renderTurn();
    };

    const updateGameStateUI = () => {
        if (!game.getIsGameOver()) {
            renderTurn();
            return false;
        }

        if (game.getWinner()) {
            const winnerName = game.getWinner().getName();
            updateScore(winnerName);
            renderScores();

            if (hasMatchWinner()) {
                modal.classList.remove('hidden');
                modalMessage.textContent = winnerName + ' Won the Match!';
                return true;
            }

            playerTurnMessage.textContent = winnerName + ' won this round!';
            setTimeout(() => {
                resetRound();
            }, 2000);

            return true;
        }

        if (game.getIsTie()) {
            playerTurnMessage.textContent = "It's a tie!";
            setTimeout(() => {
                resetRound();
            }, 2000);

            return true;
        }

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

    const handleModalBtn = () => {
        resetMatch();
    };

    form.addEventListener('submit', handleStartGame);
    cantPlayer1Input.addEventListener('change', handleCantPlayers);
    cantPlayer2Input.addEventListener('change', handleCantPlayers);
    modalBtn.addEventListener('click', handleModalBtn);

    handleCantPlayers();
}

DisplayController();