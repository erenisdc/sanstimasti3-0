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
    currentSpeakerIndex: 0
};

// Initialize game
function initGame() {
    showScreen('welcome-screen');
    updatePlayerNames(); // Initialize player name inputs
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
    
    // Initialize game state
    gameState.players = [];
    gameState.currentPlayerIndex = 0;
    gameState.selectedCategory = category;
    gameState.discussionTime = discussionTime;
    gameState.timerEnabled = timerEnabled;
    gameState.votes = {};
    gameState.gamePhase = 'wordReveal';
    
    // Create players with custom names
    for (let i = 1; i <= playerCount; i++) {
        const nameInput = document.getElementById(`player-name-${i}`);
        const playerName = nameInput.value.trim() || `Player ${i}`;
        
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
    
    gameState.players.forEach(player => {
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing game...');
    console.log('WORD_LIST available:', typeof WORD_LIST !== 'undefined');
    initGame();
});
