document.addEventListener("DOMContentLoaded", function () {
    const menuScreen = document.querySelector('.menu-screen');
    const GameScreen = document.querySelector('.game-screen');


    const startBtn = document.querySelector('.start');

    //Event listener for the "Start" button
    startBtn.addEventListener("click", function () {
        //hide menu screen
        menuScreen.style.display = "none";

        //show game screen
        GameScreen.style.display = "block";

        handleRestartGame();
    });


    const statusDisplay = document.querySelector('.game--status');
    const RoundDisplay = document.querySelector('.round--status');




    let gameActive = true;
    let currentPlayer = "X"
    let gameState = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]; // extended to 16 spaces fo 4x4 grid

    let timerXValue = 30;
    let timerOValue = 30;
    let timerXInterval;
    let timerOInterval;

    let timerStarted = false;
    //keep track of games and wins with variables:
    let gamesPlayed = 0;
    let winX = 0;
    let winO = 0;
    let draw = 0;




    //Game themes
    const themes = {
        classic: {
            name: 'Classic',
            xImage: 'X.png',
            oImage: 'O.png',
        },
        minion: {
            name: 'Minion',
            xImage: 'minion.png',
            oImage: 'minion_evil.png',
        },
        star: {
            name: 'Star Wars',
            xImage: 'R2D2.png',
            oImage: 'vader.png',
        },
    };


   
    //Update Game Timers
    function updateTimerXDisplay() {
        document.getElementById('timerX').textContent = timerXValue;
    }

    function updateTimerODisplay() {
        document.getElementById('timerO').textContent = timerOValue;
    }

    function updateScore() {
        document.getElementById('Games').textContent = gamesPlayed;
        document.getElementById('Win01').textContent = winX;
        document.getElementById('Win02').textContent = winO;
        document.getElementById('GameDraw').textContent = draw;
    }



    function startTimerX() {
        timerXInterval = setInterval(() => {
            if (timerXValue > 0) {
                timerXValue--;
                updateTimerXDisplay();
            } else {
                //Player x runs out of time
                clearInterval(timerXInterval);
                handlePlayerTimeout('X');
            }
        }, 700 //timer updates every half a second approx
        )
    }

    function startTimerO() {
        timerOInterval = setInterval(() => {
            if (timerOValue > 0) {
                timerOValue--;
                updateTimerODisplay();
            } else {
                //Player x runs out of time
                clearInterval(timerOInterval);
                handlePlayerTimeout('O');
            }
        }, 700 //timer updates every half a second approx
        )
    }

    function stopTimers() {
        clearInterval(timerXInterval);
        clearInterval(timerOInterval);
    }

    function setDifficulty() {
        const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value; //retrieves value selected on radio buttons, which is then stored in a variable
        const difficulty = selectedDifficulty;

        if (difficulty === 'hard') {
            timerXValue = 5;
            timerOValue = 5;
        } else if (difficulty === 'medium') {
            timerXValue = 20;
            timerOValue = 20;
        } else {
            timerXValue = 30;
            timerOValue = 30;
        }

    }

    function handlePlayerTimeout(player) {

        if (!gameActive) {
            return;
        }

        stopTimers();
        statusDisplay.innerHTML = `Player ${player} out of time.  Player ${player === 'X' ? 'O' : 'X'} wins!`;
        gameActive = false;
        if (player === 'X') {
            winO++;
        } else {
            winX++;
        }
        gamesPlayed++;
        updateScore();

        if (gamesPlayed === 3) {
            declareRoundWinner();
        } else {
            RoundDisplay.innerHTML = '';
        };
    }



    statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;

    function handleRestartGame() {
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];  // extended to 16 spaces for the 4x4 grid
        statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
        document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");



        //Start timer for Player X

        //reset both players timers
        setDifficulty();
        updateTimerXDisplay();
        updateTimerODisplay();


        stopTimers(); // stop both timers when game is restarted

        if (gamesPlayed === 3) {
            declareRoundWinner();
            //reset scores after 3 games
            winX = 0;
            winO = 0;
            draw = 0;
            gamesPlayed = 0;


        } else {
            RoundDisplay.innerHTML = '';
            updateScore();
        }



    }
    function handleReset() {
        winX = 0;
        winO = 0;
        draw = 0;
        gamesPlayed = 0;
        updateScore();
    }

    /*Return to main menu*/
    function main_menu() {
        //show menu screen
        menuScreen.style.display = "block";

        //hide game screen
        GameScreen.style.display = "none";
    }



    function handleCellClick(clickedCellEvent) {
        if (!gameActive) {
            return;
        }

        const selectedOpponent = document.querySelector('input[name="opponent"]:checked').value;

        //Prevents human player from making a move when it is the computers turn
        if (selectedOpponent === 'computer' && currentPlayer !=='X'){
            return;
        }

        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        stopTimers();  //stop both players timers

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();

       
        if (gameActive && selectedOpponent === 'computer' ) {
            setTimeout(() => {
                handleComputerMove();
                // start timer for the player that makes a move
                if (gameActive) {
                    if (currentPlayer === "X") {
                        startTimerX();
                    } else {
                        startTimerO();
                    }
                }
            }, 500)
            

        } else { // start timer for the player that makes a move
            if (gameActive) {
                if (currentPlayer === "X") {
                    startTimerX();
                } else {
                    startTimerO();
                }
            }
        }

        
      





    }


    function handleCellPlayed(clickedCell, clickedCellIndex) {
        const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
        const theme = themes[selectedTheme];
        gameState[clickedCellIndex] = currentPlayer;
        if (currentPlayer == "X") { clickedCell.innerHTML = `<img src= "${theme.xImage}" alt = 'X' width = '100' height = '100'>`; }
        else { clickedCell.innerHTML = `<img src= "${theme.oImage}" alt = 'O' width = '100' height = '100'>`; }

    }

    function GenerateComputerMove() {
        //creates an array , which later will be used to store currently empty cells
        const emptyCell = [];
        //iterats through the gameState array to find currrently empty cells and stores them in "emptyCell"
        gameState.forEach((cell, index) => {
            if (cell === "") {
                emptyCell.push(index);
            }
        });

        //calculates a random empty cell by multiplying a random decimal and storing it in a variable
        const random = Math.floor(Math.random() * emptyCell.length);
        return emptyCell[random];

    }

    function handleComputerMove() {
        if (!gameActive || currentPlayer === "X") {
            return;
        }

        const computerIndex = GenerateComputerMove();
        const computerTurn = document.querySelector(`.cell[data-cell-index="${computerIndex}"]`);

        handleCellPlayed(computerTurn, computerIndex);
        handleResultValidation();

        


    }



    const winningConditions = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
        [0, 5, 10, 15],
        [3, 6, 9, 12]
    ];


    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 9; i++) {  //changed to 9 to iterate through the winning conditions of the 4x4 grid
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];
            let d = gameState[winCondition[3]];   //added extra winning conditions
            if (a === '' || b === '' || c === '' || d === '') {  //checks if all 4 conditions are empty, if so it moves to next condition
                continue;
            }
            if (a === b && b === c && c === d) {  //added the extra condition that checks if the values match
                roundWon = true;
                break
            }
        }

        if (roundWon) {
            stopTimers();
            statusDisplay.innerHTML = `Player ${currentPlayer} has won!`;
            gameActive = false;
            if (currentPlayer === 'X') {
                winX++;
            } else {
                winO++;
            }
            gamesPlayed++;
            updateScore();
            return;



        }

        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            stopTimers();
            statusDisplay.innerHTML = `Game ended in a draw!`;
            gameActive = false;
            draw++;
            gamesPlayed++;
            updateScore();
            return;


        }








        handlePlayerChange();

    }

    function handlePlayerChange() {
        console.log('changing player')
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
    }

    function declareRoundWinner() {

        if (winX > winO) {
            RoundDisplay.innerHTML = 'Player 1 wins the round!';
        } else if (winO > winX) {
            RoundDisplay.innerHTML = 'Player 2 wins the round!';
        } else {
            RoundDisplay.innerHTML = 'The round ended in a draw!';
        }



        updateScore();
    }




    document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
    document.querySelector('.game--restart').addEventListener('click', handleRestartGame);
    document.querySelector('.reset--score').addEventListener('click', handleReset);
    document.querySelector('.returnbtn').addEventListener('click', main_menu);



});
