// Game state management
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    spyIndex: -1,
    selectedCategory: 'all',
    discussionTime: 180,
    timerEnabled: true,
    currentWordPair: null,
    votes: {},
    gamePhase: 'setup', // setup, wordReveal, discussion, voting, results
    timer: null,
    timeRemaining: 0,
    startingPlayerIndex: 0,
    currentSpeakerIndex: 0,
    votingRounds: 1,
    currentVotingRound: 1,
    eliminatedPlayers: [],
    roundVotes: {}
};

// Persistent score tracking
let playerScores = {};

// Initialize game
function initGame() {
    showScreen('welcome-screen');
    updatePlayerNames(); // Initialize player name inputs
    updateScoreDisplay();
}

// Update player name inputs based on selected count
function updatePlayerNames() {
    const playerCount = parseInt(document.getElementById('player-count').value);
    const container = document.getElementById('player-names-container');
    container.innerHTML = '';
    
    for (let i = 1; i <= playerCount; i++) {
        const inputDiv = document.createElement('div');
        inputDiv.className = 'player-name-input';
        inputDiv.innerHTML = `
            <input type="text" id="player-name-${i}" placeholder="Player ${i}" value="Player ${i}">
        `;
        container.appendChild(inputDiv);
    }
}

// Toggle timer options visibility
function toggleTimerOptions() {
    const timerEnabled = document.getElementById('timer-enabled').checked;
    const timerOptions = document.getElementById('timer-options');
    
    if (timerEnabled) {
        timerOptions.classList.remove('hidden');
    } else {
        timerOptions.classList.add('hidden');
    }
}

// Screen management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
    
    // Clear any running timers
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
}

// Start new game
function startGame() {
    const playerCount = parseInt(document.getElementById('player-count').value);
    const category = document.getElementById('category-select').value;
    const timerEnabled = document.getElementById('timer-enabled').checked;
    const discussionTime = parseInt(document.getElementById('timer-select').value);
    const votingRounds = parseInt(document.getElementById('voting-rounds').value);
    
    // Initialize game state
    gameState.players = [];
    gameState.currentPlayerIndex = 0;
    gameState.selectedCategory = category;
    gameState.discussionTime = discussionTime;
    gameState.timerEnabled = timerEnabled;
    gameState.votingRounds = votingRounds;
    gameState.currentVotingRound = 1;
    gameState.votes = {};
    gameState.eliminatedPlayers = [];
    gameState.roundVotes = {};
    gameState.gamePhase = 'wordReveal';
    
    // Create players with custom names
    for (let i = 1; i <= playerCount; i++) {
        const nameInput = document.getElementById(`player-name-${i}`);
        const playerName = nameInput.value.trim() || `Player ${i}`;
        
        // Initialize score if new player
        if (!playerScores[playerName]) {
            playerScores[playerName] = 0;
        }
        
        gameState.players.push({
            id: i,
            name: playerName,
            isSpy: false,
            word: '',
            hasSeenWord: false
        });
    }
    
    // Select random starting player and spy
    gameState.startingPlayerIndex = Math.floor(Math.random() * playerCount);
    gameState.currentPlayerIndex = gameState.startingPlayerIndex;
    gameState.currentSpeakerIndex = gameState.startingPlayerIndex;
    
    gameState.spyIndex = Math.floor(Math.random() * playerCount);
    gameState.players[gameState.spyIndex].isSpy = true;
    
    // Get random word pair
    gameState.currentWordPair = getRandomWordPair(category);
    
    // Assign words
    gameState.players.forEach((player, index) => {
        if (index === gameState.spyIndex) {
            player.word = gameState.currentWordPair.spy;
        } else {
            player.word = gameState.currentWordPair.civilian;
        }
    });
    
    // Show word reveal screen
    showWordRevealScreen();
}

// Word reveal phase
function showWordRevealScreen() {
    showScreen('word-screen');
    updateWordRevealDisplay();
}

function updateWordRevealDisplay() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    document.getElementById('current-player').textContent = currentPlayer.name;
    
    // Show progress indicator
    const playersWhoHaveSeen = gameState.players.filter(p => p.hasSeenWord).length;
    const totalPlayers = gameState.players.length;
    document.getElementById('current-player').textContent = `${currentPlayer.name} (${playersWhoHaveSeen + 1}/${totalPlayers})`;
    
    // Reset word card
    const wordCard = document.getElementById('word-card');
    const wordFront = wordCard.querySelector('.word-front');
    const wordBack = wordCard.querySelector('.word-back');
    
    wordFront.style.display = 'block';
    wordBack.classList.add('hidden');
    
    // Update word content
    document.getElementById('player-word').textContent = currentPlayer.word;
    
    // Update buttons
    document.getElementById('next-player-btn').style.display = 'none';
    document.getElementById('start-discussion-btn').style.display = 'none';
    
    // Reset card click handler
    wordCard.onclick = revealWord;
}

function revealWord() {
    const wordCard = document.getElementById('word-card');
    const wordFront = wordCard.querySelector('.word-front');
    const wordBack = wordCard.querySelector('.word-back');
    
    // Smooth transition - fade out front, fade in back
    wordFront.style.opacity = '0';
    
    setTimeout(() => {
        wordFront.style.display = 'none';
        wordBack.classList.remove('hidden');
        wordBack.style.opacity = '1';
    }, 150);
    
    // Mark player as having seen word
    gameState.players[gameState.currentPlayerIndex].hasSeenWord = true;
    
    // Check if all players have seen their words
    const allPlayersSeen = gameState.players.every(player => player.hasSeenWord);
    
    if (allPlayersSeen) {
        document.getElementById('start-discussion-btn').style.display = 'block';
    } else {
        document.getElementById('next-player-btn').style.display = 'block';
    }
    
    // Remove click handler
    wordCard.onclick = null;
}

function nextPlayer() {
    // Mark current player as having seen their word
    gameState.players[gameState.currentPlayerIndex].hasSeenWord = true;
    
    // Move to next player in circular order
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    
    // Check if we've completed the circle (all players have seen words)
    if (gameState.currentPlayerIndex === gameState.startingPlayerIndex) {
        // All players have seen their words
        document.getElementById('next-player-btn').style.display = 'none';
        document.getElementById('start-discussion-btn').style.display = 'block';
        return;
    }
    
    updateWordRevealDisplay();
}

// Discussion phase
function startDiscussion() {
    gameState.gamePhase = 'discussion';
    gameState.timeRemaining = gameState.discussionTime;
    
    showScreen('discussion-screen');
    
    // Update display
    document.getElementById('player-count-display').textContent = `${gameState.players.length} Players`;
    document.getElementById('category-display').textContent = gameState.selectedCategory === 'all' ? 'All Categories' : gameState.selectedCategory.charAt(0).toUpperCase() + gameState.selectedCategory.slice(1);
    
    // Show/hide timer based on settings
    const timerDisplay = document.getElementById('timer-display');
    if (gameState.timerEnabled) {
        timerDisplay.style.display = 'block';
        startTimer();
    } else {
        timerDisplay.style.display = 'none';
    }
}


function startTimer() {
    updateTimerDisplay();
    
    gameState.timer = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();
        
        if (gameState.timeRemaining <= 0) {
            clearInterval(gameState.timer);
            startVoting();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    const timerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timer-text').textContent = timerText;
    
    // Add warning style for last 30 seconds
    const timerCircle = document.querySelector('.timer-circle');
    if (gameState.timeRemaining <= 30) {
        timerCircle.classList.add('warning');
    } else {
        timerCircle.classList.remove('warning');
    }
}

// Voting phase
function startVoting() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    gameState.gamePhase = 'voting';
    gameState.votes = {};
    
    showScreen('voting-screen');
    createVotingGrid();
}

function createVotingGrid() {
    const votingGrid = document.getElementById('voting-players');
    votingGrid.innerHTML = '';
    
    // Show voting round info
    const votingInfo = document.getElementById('voting-info');
    if (votingInfo) {
        votingInfo.innerHTML = `
            <h3>Voting Round ${gameState.currentVotingRound} of ${gameState.votingRounds}</h3>
            <p>Vote for who you think is the spy!</p>
        `;
    }
    
    // Only show players who haven't been eliminated
    const activePlayers = gameState.players.filter(player => !gameState.eliminatedPlayers.includes(player.id));
    
    activePlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-vote-card';
        playerCard.onclick = () => selectPlayer(player.id);
        
        playerCard.innerHTML = `
            <i class="fas fa-user"></i>
            <span>${player.name}</span>
        `;
        
        votingGrid.appendChild(playerCard);
    });
}

function selectPlayer(playerId) {
    // Remove previous selection
    document.querySelectorAll('.player-vote-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    event.target.closest('.player-vote-card').classList.add('selected');
    
    // Store vote (simplified - in real game, each player would vote)
    gameState.votes[playerId] = (gameState.votes[playerId] || 0) + 1;
    
    // Enable results button
    document.getElementById('show-results-btn').disabled = false;
}

// Results phase
function showResults() {
    // Calculate results for current round
    const votedPlayer = getMostVotedPlayer();
    gameState.roundVotes[gameState.currentVotingRound] = votedPlayer;
    
    // Check if voted player is the spy
    const isSpyFound = votedPlayer && votedPlayer.id === gameState.players[gameState.spyIndex].id;
    
    if (isSpyFound || gameState.currentVotingRound >= gameState.votingRounds) {
        // Game ends - either spy found or max rounds reached
        gameState.gamePhase = 'results';
        showScreen('results-screen');
        displayFinalResults(isSpyFound);
    } else {
        // Eliminate voted player and continue to next round
        if (votedPlayer) {
            gameState.eliminatedPlayers.push(votedPlayer.id);
        }
        gameState.currentVotingRound++;
        
        // Show intermediate results then continue
        showIntermediateResults(votedPlayer);
    }
}

function showIntermediateResults(eliminatedPlayer) {
    gameState.gamePhase = 'results';
    showScreen('results-screen');
    
    const resultHeader = document.getElementById('game-result');
    const spyReveal = document.getElementById('spy-reveal');
    const resultMessage = document.getElementById('result-message');
    const gameActions = document.querySelector('.game-actions');
    
    resultHeader.textContent = `Round ${gameState.currentVotingRound - 1} Results`;
    
    if (eliminatedPlayer) {
        spyReveal.innerHTML = `
            <div class="eliminated-player">
                <i class="fas fa-user-times"></i>
                <h3>${eliminatedPlayer.name} was eliminated!</h3>
                <p>They were ${eliminatedPlayer.id === gameState.players[gameState.spyIndex].id ? 'the SPY!' : 'NOT the spy'}</p>
            </div>
        `;
        
        if (eliminatedPlayer.id === gameState.players[gameState.spyIndex].id) {
            resultMessage.innerHTML = '<p class="win-message">🎉 Civilians win! The spy has been found!</p>';
            gameActions.innerHTML = `
                <button class="btn btn-primary" onclick="playAgain()">
                    <i class="fas fa-redo"></i> Play Again
                </button>
                <button class="btn btn-secondary" onclick="showScreen('welcome-screen')">
                    <i class="fas fa-home"></i> Main Menu
                </button>
            `;
        } else {
            resultMessage.innerHTML = `<p>Round ${gameState.currentVotingRound} starting soon...</p>`;
            gameActions.innerHTML = `
                <button class="btn btn-primary" onclick="startNextVotingRound()">
                    <i class="fas fa-arrow-right"></i> Next Voting Round
                </button>
            `;
        }
    } else {
        spyReveal.innerHTML = '<p>No one was eliminated this round.</p>';
        resultMessage.innerHTML = `<p>Round ${gameState.currentVotingRound} starting soon...</p>`;
        gameActions.innerHTML = `
            <button class="btn btn-primary" onclick="startNextVotingRound()">
                <i class="fas fa-arrow-right"></i> Next Voting Round
            </button>
        `;
    }
}

function startNextVotingRound() {
    // Check if spy was eliminated or max rounds reached
    const spyEliminated = gameState.eliminatedPlayers.includes(gameState.players[gameState.spyIndex].id);
    const activePlayers = gameState.players.filter(player => !gameState.eliminatedPlayers.includes(player.id));
    
    if (spyEliminated || gameState.currentVotingRound > gameState.votingRounds || activePlayers.length <= 2) {
        // Game ends
        gameState.gamePhase = 'results';
        showScreen('results-screen');
        displayFinalResults(spyEliminated);
    } else {
        // Continue to next voting round
        startVoting();
    }
}

function displayFinalResults(spyFound) {
    const resultHeader = document.getElementById('game-result');
    const spyReveal = document.getElementById('spy-reveal');
    const resultMessage = document.getElementById('result-message');
    const gameActions = document.querySelector('.game-actions');
    
    resultHeader.textContent = 'Final Results';
    
    const spyPlayer = gameState.players[gameState.spyIndex];
    spyReveal.innerHTML = `
        <div class="spy-reveal">
            <i class="fas fa-user-secret"></i>
            <h3>The Spy was: ${spyPlayer.name}</h3>
            <p><strong>Spy word:</strong> ${spyPlayer.word}</p>
            <p><strong>Civilian word:</strong> ${gameState.currentWordPair.civilian}</p>
        </div>
    `;
    
    // Update scores based on game outcome
    updatePlayerScores(spyFound);
    
    if (spyFound) {
        resultMessage.innerHTML = '<p class="win-message">🎉 Civilians win! The spy was found!</p>';
    } else {
        resultMessage.innerHTML = '<p class="lose-message">🕵️ Spy wins! They remained undetected!</p>';
    }
    
    // Show eliminated players summary
    if (gameState.eliminatedPlayers.length > 0) {
        const eliminatedNames = gameState.eliminatedPlayers.map(id => 
            gameState.players.find(p => p.id === id).name
        ).join(', ');
        resultMessage.innerHTML += `<p class="eliminated-summary">Eliminated players: ${eliminatedNames}</p>`;
    }
    
    // Show score updates
    resultMessage.innerHTML += generateScoreUpdate(spyFound);
    
    gameActions.innerHTML = `
        <button class="btn btn-primary" onclick="playAgain()">
            <i class="fas fa-redo"></i> Play Again
        </button>
        <button class="btn btn-secondary" onclick="resetScoresAndGoHome()">
            <i class="fas fa-home"></i> Main Menu
        </button>
    `;
}

// Original showResults function renamed
function showResultsOld() {
    gameState.gamePhase = 'results';
    showScreen('results-screen');
    
    // Calculate results
    const votedPlayer = getMostVotedPlayer();
    const spyPlayer = gameState.players[gameState.spyIndex];
    const spyCaught = votedPlayer && votedPlayer.id === spyPlayer.id;
    
    // Update result display
    const resultHeader = document.getElementById('game-result');
    const resultIcon = document.getElementById('result-icon');
    
    if (spyCaught) {
        resultHeader.textContent = 'Players Win!';
        resultIcon.innerHTML = '<i class="fas fa-trophy"></i>';
        resultIcon.className = 'result-icon win';
    } else {
        resultHeader.textContent = 'Spy Wins!';
        resultIcon.innerHTML = '<i class="fas fa-user-secret"></i>';
        resultIcon.className = 'result-icon lose';
    }
    
    // Show spy
    document.getElementById('spy-name').textContent = spyPlayer.name;
    
    // Show words
    document.getElementById('civilian-word').textContent = gameState.currentWordPair.civilian;
    document.getElementById('spy-word').textContent = gameState.currentWordPair.spy;
    
    // Show voting results
    displayVotingResults();
}

function getMostVotedPlayer() {
    let maxVotes = 0;
    let mostVotedPlayer = null;
    
    Object.keys(gameState.votes).forEach(playerId => {
        const votes = gameState.votes[playerId];
        if (votes > maxVotes) {
            maxVotes = votes;
            mostVotedPlayer = gameState.players.find(p => p.id == playerId);
        }
    });
    
    return mostVotedPlayer;
}

function displayVotingResults() {
    const votingResults = document.getElementById('voting-results');
    votingResults.innerHTML = '<h4>Voting Results</h4>';
    
    // Sort players by votes received
    const sortedResults = gameState.players
        .map(player => ({
            player: player,
            votes: gameState.votes[player.id] || 0
        }))
        .sort((a, b) => b.votes - a.votes);
    
    sortedResults.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'vote-result-item';
        resultItem.innerHTML = `
            <span>${result.player.name}${result.player.isSpy ? ' (SPY)' : ''}</span>
            <span>${result.votes} vote${result.votes !== 1 ? 's' : ''}</span>
        `;
        votingResults.appendChild(resultItem);
    });
}

// Game controls
function playAgain() {
    // Reset game state but keep same players and settings
    gameState.votes = {};
    gameState.gamePhase = 'setup';
    
    // Reset player states
    gameState.players.forEach(player => {
        player.isSpy = false;
        player.word = '';
        player.hasSeenWord = false;
    });
    
    // Select new random starting player and spy
    gameState.startingPlayerIndex = Math.floor(Math.random() * gameState.players.length);
    gameState.currentPlayerIndex = gameState.startingPlayerIndex;
    gameState.currentSpeakerIndex = gameState.startingPlayerIndex;
    
    gameState.spyIndex = Math.floor(Math.random() * gameState.players.length);
    gameState.players[gameState.spyIndex].isSpy = true;
    
    // Get new random word pair
    gameState.currentWordPair = getRandomWordPair(gameState.selectedCategory);
    
    // Assign new words
    gameState.players.forEach((player, index) => {
        if (index === gameState.spyIndex) {
            player.word = gameState.currentWordPair.spy;
        } else {
            player.word = gameState.currentWordPair.civilian;
        }
    });
    
    // Show word reveal screen
    showWordRevealScreen();
}

// Score management functions
function updatePlayerScores(spyFound) {
    const spyPlayer = gameState.players[gameState.spyIndex];
    
    if (spyFound) {
        // Civilians win - each civilian gets 1 point
        gameState.players.forEach(player => {
            if (!player.isSpy) {
                playerScores[player.name] += 1;
            }
        });
    } else {
        // Spy wins - spy gets 3 points
        playerScores[spyPlayer.name] += 3;
    }
}

function generateScoreUpdate(spyFound) {
    let scoreHTML = '<div class="score-update"><h4>Score Update:</h4>';
    
    if (spyFound) {
        // Show civilian winners
        const civilians = gameState.players.filter(p => !p.isSpy);
        scoreHTML += '<p class="score-gain">Civilians +1 point each:</p><ul>';
        civilians.forEach(player => {
            scoreHTML += `<li>${player.name}: ${playerScores[player.name]} points</li>`;
        });
        scoreHTML += '</ul>';
    } else {
        // Show spy winner
        const spyPlayer = gameState.players[gameState.spyIndex];
        scoreHTML += `<p class="score-gain">${spyPlayer.name} (Spy) +3 points: ${playerScores[spyPlayer.name]} points</p>`;
    }
    
    scoreHTML += '</div>';
    return scoreHTML;
}

function updateScoreDisplay() {
    const scoreContainer = document.getElementById('score-display');
    if (!scoreContainer) return;
    
    const sortedScores = Object.entries(playerScores)
        .sort(([,a], [,b]) => b - a)
        .filter(([name, score]) => score > 0);
    
    if (sortedScores.length === 0) {
        scoreContainer.innerHTML = '<p>No scores yet - start playing!</p>';
        return;
    }
    
    let scoreHTML = '<h3>Current Scores</h3><div class="score-list">';
    sortedScores.forEach(([name, score], index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        scoreHTML += `<div class="score-item">${medal} ${name}: ${score} points</div>`;
    });
    scoreHTML += '</div>';
    
    scoreContainer.innerHTML = scoreHTML;
}

function resetScoresAndGoHome() {
    playerScores = {};
    showScreen('welcome-screen');
    updateScoreDisplay();
}

function playAgain() {
    // Keep scores intact, just restart the game
    showScreen('setup-screen');
    updateScoreDisplay();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing game...');
    console.log('WORD_LIST available:', typeof WORD_LIST !== 'undefined');
    initGame();
});
