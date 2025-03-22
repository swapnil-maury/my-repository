function rando() {
    let a = Math.random();
    return (Math.floor(a * 6) + 1);
}

// Get number of players from localStorage (default to 2 if not set)
const numberOfPlayers = parseInt(localStorage.getItem('numberOfPlayers')) || 2;
// Player colors (array to map player number to color)
const playerColors = ['green', 'red', 'blue', 'yellow'];

let turn = 0;
let gameInProgress = false;

let body= document.body;

// Initialize the game board with the correct number of players
function initializeGame() {
    // Clear existing players from position 1
    document.getElementById('1').innerHTML = '';
    
    // Add each player to the starting position
    for (let i = 0; i < numberOfPlayers; i++) {
        let playerDiv = document.createElement('div');
        playerDiv.classList.add('button2', 'initial');
        playerDiv.setAttribute('id', `player${i+1}`);
        
        // Set player color based on the playerColors array
        playerDiv.style.backgroundColor = playerColors[i];
        
        // Apply appropriate outline based on color
        switch(playerColors[i]) {
            case 'red':
                playerDiv.style.outlineColor = 'rgb(180, 0, 0)';
                break;
            case 'green':
                playerDiv.style.outlineColor = 'rgb(16, 120, 16)';
                break;
            case 'blue':
                playerDiv.style.outlineColor = 'rgb(0, 60, 200)';
                break;
            case 'yellow':
                playerDiv.style.outlineColor = 'rgb(180, 140, 0)';
                break;
        }
        
        // Apply responsive sizing for initial tokens
        if (window.innerWidth <= 480) {
            playerDiv.style.width = "3vw";
            playerDiv.style.height = "3vw";
            playerDiv.style.transform = "scale(0.75)";
            playerDiv.style.outlineWidth = "2px";
            playerDiv.style.outlineOffset = "-3px";
        } else if (window.innerWidth <= 768) {
            playerDiv.style.width = "2.5vw";
            playerDiv.style.height = "2.5vw";
            playerDiv.style.transform = "scale(0.8)";
            playerDiv.style.outlineWidth = "3px";
            playerDiv.style.outlineOffset = "-3px";
        } else {
            // For larger screens, keep size proportional to board
            const boardSize = document.querySelector('.another').offsetWidth;
            const tokenSize = Math.min(boardSize * 0.02, 20); // 2% of board width, max 20px
            playerDiv.style.width = `${tokenSize}px`;
            playerDiv.style.height = `${tokenSize}px`;
            playerDiv.style.transform = "scale(0.8)";
            playerDiv.style.outlineWidth = "3px";
            playerDiv.style.outlineOffset = "-4px";
        }
        
        document.getElementById('1').appendChild(playerDiv);
    }
    
    // Set initial player turn text
    updatePlayerTurnText();
    
    // Add game info
    addGameInfo();
}

// Keep track of how many players have finished and their rankings
let finishedPlayers = 0;
let playerRankings = [];

// Function to show game over screen with options and rankings
function showGameOverScreen(showFinalRanking = false) {
    // Play game over sound
    document.getElementsByClassName("gameover")[0].innerHTML = `<audio src="snake and ladder image/gameover.mp3" autoplay></audio>`;
    
    // Create game over container with rankings
    let rankingsHTML = '';
    
    if (showFinalRanking) {
        // Show all players' rankings
        rankingsHTML = '<div class="rankings">';
        for (let i = 0; i < playerRankings.length; i++) {
            const playerColor = playerRankings[i].charAt(0).toUpperCase() + playerRankings[i].slice(1);
            rankingsHTML += `<div class="rank-item">
                <span class="rank-position">${i+1}</span>
                <span class="rank-dot" style="background-color: ${playerRankings[i]}"></span>
                <span class="rank-name">${playerColor}</span>
            </div>`;
        }
        
        // If there's one player remaining, add them as last place
        if (playerRankings.length < numberOfPlayers) {
            const remainingPlayers = [];
            for (let i = 0; i < numberOfPlayers; i++) {
                if (!playerRankings.includes(playerColors[i])) {
                    remainingPlayers.push(playerColors[i]);
                }
            }
            
            for (const player of remainingPlayers) {
                const playerColor = player.charAt(0).toUpperCase() + player.slice(1);
                rankingsHTML += `<div class="rank-item">
                    <span class="rank-position">${playerRankings.length + 1}</span>
                    <span class="rank-dot" style="background-color: ${player}"></span>
                    <span class="rank-name">${playerColor}</span>
                </div>`;
            }
        }
        
        rankingsHTML += '</div>';
    } else {
        // Show just the first place winner
        const winnerColor = playerRankings[0].charAt(0).toUpperCase() + playerRankings[0].slice(1);
        rankingsHTML = `<div class="winner">${winnerColor} won this game!</div>`;
    }
    
    const gameOverHTML = `
        <div class="gameover">
            GAME OVER
            ${rankingsHTML}
            <div class="game-over-options">
                <button id="play-again" class="game-over-btn">Play Again</button>
                <button id="change-players" class="game-over-btn">Change Players</button>
            </div>
        </div>
    `;
    
    document.getElementsByClassName("another")[0].innerHTML = gameOverHTML;
    document.getElementsByClassName("playerturn")[0].style.display = "none";
    
    // Add event listeners to buttons
    setTimeout(() => {
        document.getElementById("play-again").addEventListener("click", () => {
            // Reset game with same players
            window.location.reload();
        });
        
        document.getElementById("change-players").addEventListener("click", () => {
            // Go to player selection screen
            window.location.href = "start.html";
        });
    }, 100);
    
    // Game over, disable further inputs permanently
    gameInProgress = true;
}

// Add game information showing current players
function addGameInfo() {
    const infoDiv = document.createElement('div');
    infoDiv.setAttribute('id', 'player-count');
    infoDiv.style.position = 'fixed';
    infoDiv.style.top = '20px';
    infoDiv.style.right = '20px';
    infoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    infoDiv.style.color = 'white';
    infoDiv.style.padding = '10px 15px';
    infoDiv.style.borderRadius = '5px';
    infoDiv.style.zIndex = '1000';
    
    let playersText = `<div style="font-weight: bold; margin-bottom: 5px;"><span id="player-count-kill">× &nbsp;</span>Players</div>`;
    
    for (let i = 0; i < numberOfPlayers; i++) {
        const color = playerColors[i];
        const colorName = color.charAt(0).toUpperCase() + color.slice(1);
        playersText += `<div style="display: flex; align-items: center; margin: 5px 0;">
            <div style="width: 15px; height: 15px; background-color: ${color}; border-radius: 50%; margin-right: 10px;"></div>
            <div>Player ${i+1}: ${colorName}</div>
        </div>`;
    }
    
    infoDiv.innerHTML = playersText;
    document.body.appendChild(infoDiv);
    
    // Use setTimeout to ensure the DOM element is rendered before adding the event listener
    setTimeout(() => {
        const closeButton = document.getElementById('player-count-kill');
        if (closeButton) {
            closeButton.style.cursor = 'pointer';
            closeButton.addEventListener('click', () => {
                document.getElementById('player-count').style.display = 'none';
            });
        }
    }, 0);
}

// Update player turn text
function updatePlayerTurnText() {
    const playerTurnDiv = document.getElementsByClassName("playerturn")[0];
    const currentColor = playerColors[turn].charAt(0).toUpperCase() + playerColors[turn].slice(1);
    
    // Get the turn indicator element
    const turnIndicator = playerTurnDiv.querySelector('.turn-indicator');
    
    // Update the text and indicator color
    playerTurnDiv.innerHTML = `<span class="turn-indicator"></span>${currentColor}'s Turn`;
    
    // Get the indicator again after innerHTML update
    const updatedIndicator = playerTurnDiv.querySelector('.turn-indicator');
    
    // Set the background color to match current player
    updatedIndicator.style.backgroundColor = playerColors[turn];
    
    // Add a subtle border for yellow (for better visibility)
    if (playerColors[turn] === 'yellow') {
        updatedIndicator.style.border = '1px solid #999';
    } else {
        updatedIndicator.style.border = 'none';
    }
    
    // Dice position no longer changes based on player turn
    // No need to update CSS variables for dice position
}

// Call the initialize function when the page loads
window.addEventListener('DOMContentLoaded', initializeGame);

document.getElementsByClassName("dice")[0].addEventListener("click", () => {
    if (!gameInProgress) {
        gameInProgress = true;
        animatedice().then(() => {
            control().then(() => {
                gameInProgress = false;
            });
        });
    }
})

body.addEventListener("keypress",(e)=>{
    if ((e.code=="Enter"||e.code=="Space") && !gameInProgress) {
            gameInProgress = true;
            animatedice().then(() => {
                control().then(() => {
                    gameInProgress = false;
                });
            });
    }
    
})

function control(){
    return new Promise((resolve) => {
        let dispalyturn= document.getElementsByClassName("playerturn")[0];
        document.getElementsByClassName("dicero")[0].innerHTML = "";
        document.getElementsByClassName("snake")[0].innerHTML = "";
        document.getElementsByClassName("ladder")[0].innerHTML = "";

        // Check if current player has already finished
        if (playerRankings.includes(playerColors[turn])) {
            // Skip this player's turn as they've already finished
            turn = (turn + 1) % numberOfPlayers;
            
            // If we've cycled through all players and back to a finished player,
            // keep going until we find an unfinished player
            let checkCount = 0;
            while (playerRankings.includes(playerColors[turn]) && checkCount < numberOfPlayers) {
                turn = (turn + 1) % numberOfPlayers;
                checkCount++;
            }
            
            // Update player turn display
            updatePlayerTurnText();
            resolve();
            return;
        }

        let b = rando()
        document.getElementsByClassName("dice")[0].style.backgroundImage = `url("snake and ladder image/dice${b}.png")`
        let turponu = Number(document.getElementById(`player${turn + 1}`).parentElement.childElementCount)
        let turnpo = document.getElementById(`player${turn + 1}`).parentElement.getAttribute("id");
        turnpo = Number(turnpo)
        
        if (b == 6) {
            // If player rolls a 6, they get another turn
            run(turponu, b, turnpo, (turn + 1)).then(() => {
                // Check if the player finished after this move
                if (playerRankings.includes(playerColors[turn])) {
                    // If they finished, move to next player
                    turn = (turn + 1) % numberOfPlayers;
                    
                    // Skip any players who have already finished
                    let checkCount = 0;
                    while (playerRankings.includes(playerColors[turn]) && checkCount < numberOfPlayers) {
                        turn = (turn + 1) % numberOfPlayers;
                        checkCount++;
                    }
                    
                    updatePlayerTurnText();
                }
                // Otherwise, same player gets another turn (don't change turn)
                resolve();
            });
        }
        else {
            run(turponu, b, turnpo, (turn + 1)).then(() => {
                // Move to next player's turn
                turn = (turn + 1) % numberOfPlayers;
                
                // Skip any players who have already finished
                let checkCount = 0;
                while (playerRankings.includes(playerColors[turn]) && checkCount < numberOfPlayers) {
                    turn = (turn + 1) % numberOfPlayers;
                    checkCount++;
                }
                
                updatePlayerTurnText();
                resolve();
            });
        }
    });
}

function run(turponu, b, turnpo, turn) {
    return new Promise((resolve) => {
        let sum = b + turnpo;
        let ladderis = checkladder(sum);
        let snakeis = checksnake(sum);
        let turnoppo = Array.from({length: numberOfPlayers}, (_, i) => i+1).filter(p => p !== turn);
        let winner = playerColors[turn-1].charAt(0).toUpperCase() + playerColors[turn-1].slice(1);
        
        // Adjust player size to fit within cells
        const playerElement = document.getElementById(`player${turn}`);
        // Set proper fit size based on responsive design
        if (window.innerWidth <= 480) {
            playerElement.style.width = "6vw";
            playerElement.style.height = "6vw";
        } else if (window.innerWidth <= 768) {
            playerElement.style.width = "5vw";
            playerElement.style.height = "5vw";
        } else {
            playerElement.style.width = "min(4vw, 40px)";
            playerElement.style.height = "min(4vw, 40px)";
        }
        
        playerElement.classList.remove("initial");
        playerElement.parentElement.getAttribute("id");

        // Generate the path directions
        const paths = pathdecider(turnpo, b);
        
        if (paths[0] === "none") {
            // Can't move, resolve immediately
            resolve();
            return;
        }
        
        // Create function for step by step movement
        let currentPosition = turnpo;
        let stepIndex = 0;
        
        function moveNextStep() {
            if (stepIndex < paths.length) {
                // Move one step
                currentPosition++;
                
                // Update player position for this step
                if (stepIndex === 0) {
                    // First step, check if other players are on the same cell
                    const currentCell = document.getElementById(`player${turn}`).parentElement;
                    
                    // Create a list of players to preserve (all except the moving player)
                    const playersToPreserve = [];
                    turnoppo.forEach(oppTurn => {
                        const oppPlayer = currentCell.querySelector(`#player${oppTurn}`);
                        if (oppPlayer) {
                            // Store reference to player but don't clone, which was causing duplicates
                            playersToPreserve.push(oppPlayer);
                        }
                    });
                    
                    // Remove the current player first
                    const currentPlayer = currentCell.querySelector(`#player${turn}`);
                    if (currentPlayer) {
                        currentCell.removeChild(currentPlayer);
                    }
                    
                    // No need to clear the cell now - we've removed the moving player
                    // Only add back preserved players if we accidentally removed them
                    if (currentCell.innerHTML === '') {
                        playersToPreserve.forEach(player => {
                            currentCell.appendChild(player);
                        });
                    }
                } else {
                    // For subsequent steps, check if other players are in the current cell before clearing
                    const prevCell = document.getElementById(`${currentPosition - 1}`);
                    
                    if (prevCell) {
                        // Remove the current player, but keep others intact
                        const currentPlayer = prevCell.querySelector(`#player${turn}`);
                        if (currentPlayer) {
                            prevCell.removeChild(currentPlayer);
                        }
                        // We no longer need to preserve and re-add other players since we're only removing the current one
                    }
                }
                
                // Add to new position
                let div = document.createElement("div");
                div.classList.add("button2");
                div.setAttribute("id", `player${turn}`);
                
                // Add animation class for smooth movement
                div.style.animation = `move-step 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67)`;
                
                // Set player color
                const playerColor = playerColors[turn-1];
                div.style.backgroundColor = playerColor;
                
                // Apply appropriate outline based on color
                switch(playerColor) {
                    case 'red':
                        div.style.outlineColor = 'rgb(180, 0, 0)';
                        break;
                    case 'green':
                        div.style.outlineColor = 'rgb(16, 120, 16)';
                        break;
                    case 'blue':
                        div.style.outlineColor = 'rgb(0, 60, 200)';
                        break;
                    case 'yellow':
                        div.style.outlineColor = 'rgb(180, 140, 0)';
                        break;
                }
                
                // Apply responsive sizing based on viewport
                if (window.innerWidth <= 480) {
                    div.style.width = "6vw";
                    div.style.height = "6vw";
                    div.style.transform = "scale(0.75)";
                    div.style.outlineWidth = "2px";
                    div.style.outlineOffset = "-3px";
                } else if (window.innerWidth <= 768) {
                    div.style.width = "5vw";
                    div.style.height = "5vw";
                    div.style.transform = "scale(0.8)";
                    div.style.outlineWidth = "3px";
                    div.style.outlineOffset = "-3px";
                } else {
                    // For larger screens, keep size proportional to board
                    const boardSize = document.querySelector('.another').offsetWidth;
                    const tokenSize = Math.min(boardSize * 0.04, 40); // 4% of board width, max 40px
                    div.style.width = `${tokenSize}px`;
                    div.style.height = `${tokenSize}px`;
                    div.style.transform = "scale(0.9)";
                    div.style.outlineWidth = "3px";
                    div.style.outlineOffset = "-4px";
                }
                
                document.getElementById(`${currentPosition}`).append(div);
                
                // Check if we've reached 100 (winning position) - remove 80 as a winning position
                if (currentPosition == 100) {
                    // Add this player to rankings if not already there
                    if (!playerRankings.includes(playerColors[turn-1])) {
                        playerRankings.push(playerColors[turn-1]);
                        finishedPlayers++;
                        
                        // Update the live rankings display
                        updateRankingsDisplay();
                    }
                    
                    // If all players except one have finished
                    if (finishedPlayers == numberOfPlayers - 1) {
                        // Game over, show rankings
                        showGameOverScreen(true);
                        resolve();
                        return; // Stop the movement
                    } else if (finishedPlayers === 1) {
                        // Just update the rankings display
                        updateRankingsDisplay();
                    }
                }
                
                // Schedule next step
                stepIndex++;
                setTimeout(moveNextStep, 300);
            } else {
                // All steps complete, check for snake or ladder
                if (snakeis[0]) {
                    // Play snake sound immediately
                    document.getElementsByClassName("snake")[0].innerHTML = `<audio src="snake and ladder image/hiss.mp3" autoplay></audio>`;
                    
                    // Create a simple snake message
                    const snakeMessage = document.createElement('div');
                    snakeMessage.textContent = `${winner} hit a snake! Going from ${sum} to ${checksnake(sum)[2]}`;
                    snakeMessage.style.position = 'fixed';
                    snakeMessage.style.left = '50%';
                    snakeMessage.style.top = '30%';
                    snakeMessage.style.transform = 'translate(-50%, -50%)';
                    snakeMessage.style.backgroundColor = 'rgba(255, 200, 200, 0.9)';
                    snakeMessage.style.padding = '10px';
                    snakeMessage.style.borderRadius = '5px';
                    snakeMessage.style.color = 'black';
                    snakeMessage.style.zIndex = '1001';
                    document.body.appendChild(snakeMessage);
                    
                    // After a delay, move to snake end position
                    setTimeout(() => {
                        // Remove the message
                        document.body.removeChild(snakeMessage);
                        
                        // Handle multiple players at the same position
                        const currentCell = document.getElementById(`player${turn}`).parentElement;
                        
                        // Just remove the current player without affecting others
                        const currentPlayer = currentCell.querySelector(`#player${turn}`);
                        if (currentPlayer) {
                            currentCell.removeChild(currentPlayer);
                        }
                        
                        // Create new player element for destination
                        let div = document.createElement("div");
                        div.classList.add("button2", "snake-move");
                        div.setAttribute("id", `player${turn}`);
                        
                        // Set player color
                        const playerColor = playerColors[turn-1];
                        div.style.backgroundColor = playerColor;
                        
                        // Apply appropriate outline based on color
                        switch(playerColor) {
                            case 'red':
                                div.style.outlineColor = 'rgb(180, 0, 0)';
                                break;
                            case 'green':
                                div.style.outlineColor = 'rgb(16, 120, 16)';
                                break;
                            case 'blue':
                                div.style.outlineColor = 'rgb(0, 60, 200)';
                                break;
                            case 'yellow':
                                div.style.outlineColor = 'rgb(180, 140, 0)';
                                break;
                        }
                        
                        // Apply responsive sizing for the destination (for snake)
                        if (window.innerWidth <= 480) {
                            div.style.width = "6vw";
                            div.style.height = "6vw";
                            div.style.transform = "scale(0.75)";
                            div.style.outlineWidth = "2px";
                            div.style.outlineOffset = "-3px";
                        } else if (window.innerWidth <= 768) {
                            div.style.width = "5vw";
                            div.style.height = "5vw";
                            div.style.transform = "scale(0.8)";
                            div.style.outlineWidth = "3px";
                            div.style.outlineOffset = "-3px";
                        } else {
                            // For larger screens, keep size proportional to board
                            const boardSize = document.querySelector('.another').offsetWidth;
                            const tokenSize = Math.min(boardSize * 0.04, 40); // 4% of board width, max 40px
                            div.style.width = `${tokenSize}px`;
                            div.style.height = `${tokenSize}px`;
                            div.style.transform = "scale(0.9)";
                            div.style.outlineWidth = "3px";
                            div.style.outlineOffset = "-4px";
                        }
                        
                        // Add to snake destination
                        document.getElementById(`${checksnake(sum)[2]}`).append(div);
                        
                        // Check if snake destination is the winning position - only 100 counts
                        if (checksnake(sum)[2] == 100) {
                            // Add this player to rankings if not already there
                            if (!playerRankings.includes(playerColors[turn-1])) {
                                playerRankings.push(playerColors[turn-1]);
                                finishedPlayers++;
                                
                                // Update the live rankings display
                                updateRankingsDisplay();
                            }
                            
                            // If all players except one have finished
                            if (finishedPlayers == numberOfPlayers - 1) {
                                // Game over, show rankings
                                showGameOverScreen(true);
                            } else if (finishedPlayers === 1) {
                                // Just update the rankings display
                                updateRankingsDisplay();
                            }
                        }
                        
                        resolve();
                    }, 1000);
                } else if (ladderis[0]) {
                    // Play ladder sound immediately
                    document.getElementsByClassName("ladder")[0].innerHTML = `<audio src="snake and ladder image/ladder.mp3" autoplay></audio>`;
                    
                    // Create a simple ladder message
                    const ladderMessage = document.createElement('div');
                    ladderMessage.textContent = `${winner} found a ladder! Going from ${sum} to ${ladderis[2]}`;
                    ladderMessage.style.position = 'fixed';
                    ladderMessage.style.left = '50%';
                    ladderMessage.style.top = '30%';
                    ladderMessage.style.transform = 'translate(-50%, -50%)';
                    ladderMessage.style.backgroundColor = 'rgba(200, 255, 200, 0.9)';
                    ladderMessage.style.padding = '10px';
                    ladderMessage.style.borderRadius = '5px';
                    ladderMessage.style.color = 'black';
                    ladderMessage.style.zIndex = '1001';
                    document.body.appendChild(ladderMessage);
                    
                    // After a delay, move to ladder end position
                    setTimeout(() => {
                        // Remove the message
                        document.body.removeChild(ladderMessage);
                        
                        // Handle multiple players at the same position - only remove the current player
                        const currentCell = document.getElementById(`player${turn}`).parentElement;
                        const currentPlayer = currentCell.querySelector(`#player${turn}`);
                        if (currentPlayer) {
                            currentCell.removeChild(currentPlayer);
                        }
                        
                        // Create new player element for destination
                        let div = document.createElement("div");
                        div.classList.add("button2", "ladder-move");
                        div.setAttribute("id", `player${turn}`);
                        
                        // Set player color
                        const playerColor = playerColors[turn-1];
                        div.style.backgroundColor = playerColor;
                        
                        // Apply appropriate outline based on color
                        switch(playerColor) {
                            case 'red':
                                div.style.outlineColor = 'rgb(180, 0, 0)';
                                break;
                            case 'green':
                                div.style.outlineColor = 'rgb(16, 120, 16)';
                                break;
                            case 'blue':
                                div.style.outlineColor = 'rgb(0, 60, 200)';
                                break;
                            case 'yellow':
                                div.style.outlineColor = 'rgb(180, 140, 0)';
                                break;
                        }
                        
                        // Apply responsive sizing for the destination
                        if (window.innerWidth <= 480) {
                            div.style.width = "6vw";
                            div.style.height = "6vw";
                            div.style.transform = "scale(0.75)";
                            div.style.outlineWidth = "2px";
                            div.style.outlineOffset = "-3px";
                        } else if (window.innerWidth <= 768) {
                            div.style.width = "5vw";
                            div.style.height = "5vw";
                            div.style.transform = "scale(0.8)";
                            div.style.outlineWidth = "3px";
                            div.style.outlineOffset = "-3px";
                        } else {
                            // For larger screens, keep size proportional to board
                            const boardSize = document.querySelector('.another').offsetWidth;
                            const tokenSize = Math.min(boardSize * 0.04, 40); // 4% of board width, max 40px
                            div.style.width = `${tokenSize}px`;
                            div.style.height = `${tokenSize}px`;
                            div.style.transform = "scale(0.9)";
                            div.style.outlineWidth = "3px";
                            div.style.outlineOffset = "-4px";
                        }
                        
                        // Add to ladder destination
                        document.getElementById(`${ladderis[2]}`).append(div);
                        
                        // Check if ladder destination is the winning position - only 100 counts
                        if (ladderis[2] == 100) {
                            // Add this player to rankings if not already there
                            if (!playerRankings.includes(playerColors[turn-1])) {
                                playerRankings.push(playerColors[turn-1]);
                                finishedPlayers++;
                                
                                // Update the live rankings display
                                updateRankingsDisplay();
                            }
                            
                            // If all players except one have finished
                            if (finishedPlayers == numberOfPlayers - 1) {
                                // Game over, show rankings
                                showGameOverScreen(true);
                            } else if (finishedPlayers === 1) {
                                // Just update the rankings display
                                updateRankingsDisplay();
                            }
                        }
                        
                        resolve();
                    }, 1000);
                } else {
                    // No snake or ladder, all done
                    resolve();
                }
            }
        }
        
        // Start the step-by-step movement
        moveNextStep();
    });
}

function animatedice() {
    return new Promise((resolve, reject) => {
        document.getElementsByClassName("dicero")[0].innerHTML = `<audio src="snake and ladder image/dicerotate.mp3" autoplay></audio>`
        let inter = setInterval(() => {
            document.getElementsByClassName("dice")[0].classList.add("moving")
            document.getElementsByClassName("dice")[0].style.backgroundImage = `url("snake and ladder image/dice${rando()}.png")`
        }, 100);
        
        // Set timeout for animation duration (2 seconds for good visual effect)
        setTimeout(() => {
            document.getElementsByClassName("dice")[0].classList.remove("moving")
            clearInterval(inter)
            resolve("dice roll complete")
        }, 500);
    });
}

function pathdecider(num, count) {
    let a = [];
    let g = count + num;

    if (g <= 100) {
        for (let i = 0; i < count; i++) {
            if (num % 20 < 10 && num % 20 > 0) {
                a.push("right")
                num++
            }
            else if (num % 10 == 0) {
                a.push("top")
                num++
            }
            else {
                a.push("left")
                num++
            }
        }
    }
    else {
        a.push("none")
    }
    return a;
}

function checksnake(a) {
    let e = [true]
    let b = [17, 54, 62, 64, 87, 93, 95, 98]
    let c = [7, 34, 19, 60, 24, 73, 75, 79]
    for (let id = 0; id < b.length; id++) {
        if (a == b[id]) {
            e.push(b[id])
            e.push(c[id])
            return e;
        };
    }
    return false;
}

function checkladder(a) {
    let e = [true]
    let b = [1, 4, 9, 21, 28, 51, 71, 80]
    let c = [38, 14, 31, 42, 84, 67, 91, 100]
    for (let id = 0; id < b.length; id++) {
        if (a == b[id]) {
            e.push(b[id])
            e.push(c[id])
            return e;
        };
    }
    return false;
}

// Function to update player rankings display during gameplay
function updateRankingsDisplay() {
    // Create or update the rankings display if it doesn't exist
    let rankingsDisplay = document.getElementById('live-rankings');
    
    if (!rankingsDisplay) {
        rankingsDisplay = document.createElement('div');
        rankingsDisplay.id = 'live-rankings';
        rankingsDisplay.style.position = 'fixed';
        rankingsDisplay.style.bottom = '20px';
        rankingsDisplay.style.left = '20px';
        rankingsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        rankingsDisplay.style.color = 'white';
        rankingsDisplay.style.padding = '10px';
        rankingsDisplay.style.borderRadius = '5px';
        rankingsDisplay.style.zIndex = '10';
        rankingsDisplay.style.fontSize = 'clamp(12px, 2vw, 14px)';
        rankingsDisplay.style.transition = 'all 0.3s ease';
        document.body.appendChild(rankingsDisplay);
    }
    
    // Create ranking content
    let rankingsHTML = '<div style="font-weight: bold; margin-bottom: 5px;">Rankings</div>';
    
    // First show players who have reached 100
    for (let i = 0; i < playerRankings.length; i++) {
        const color = playerRankings[i];
        const colorName = color.charAt(0).toUpperCase() + color.slice(1);
        rankingsHTML += `<div style="display: flex; align-items: center; margin: 3px 0;">
            <span style="margin-right: 5px;">${i+1}.</span>
            <div style="width: 12px; height: 12px; background-color: ${color}; border-radius: 50%; margin-right: 8px;"></div>
            <div>${colorName}</div>
        </div>`;
    }
    
    // Then show players still in the game (not yet reached 100)
    let playersInGame = [];
    for (let i = 0; i < numberOfPlayers; i++) {
        if (!playerRankings.includes(playerColors[i])) {
            playersInGame.push(playerColors[i]);
        }
    }
    
    if (playersInGame.length > 0) {
        rankingsHTML += '<div style="margin-top: 5px; opacity: 0.8;">Still Playing:</div>';
        
        for (const color of playersInGame) {
            const colorName = color.charAt(0).toUpperCase() + color.slice(1);
            rankingsHTML += `<div style="display: flex; align-items: center; margin: 3px 0; opacity: 0.8;">
                <div style="width: 12px; height: 12px; background-color: ${color}; border-radius: 50%; margin-right: 8px;"></div>
                <div>${colorName}</div>
            </div>`;
        }
    }
    
    rankingsDisplay.innerHTML = rankingsHTML;
}
