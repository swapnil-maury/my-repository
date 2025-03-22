# Snake and Ladder Game

A classic Snake and Ladder board game implemented with HTML, CSS, and JavaScript.

## Features

- Support for 2-4 players
- Dynamic player selection
- Visual and sound effects for dice rolls, snakes, and ladders
- Smooth step-by-step movement animation
- Player turn tracking
- Game completion detection

## How to Play

1. Open `start.html` in your web browser
2. Select the number of players (2-4)
3. Click the "Start Game" button
4. Players take turns rolling the dice by clicking on it (or pressing Space/Enter)
5. The game automatically moves players according to the dice roll
6. If a player lands on a snake's head, they slide down to the snake's tail
7. If a player lands on the bottom of a ladder, they climb up to the top
8. The first player to reach position 100 wins!

## Game Rules

- Each player starts at position 1
- Players take turns in order: Green, Red, Blue, Yellow
- Rolling a 6 gives the player another turn
- Players must land exactly on position 100 to win (if a roll would take a player beyond 100, they don't move)
- Landing on a snake or ladder automatically moves the player to the corresponding end position

## Snakes and Ladders Positions

### Snakes
- From 17 to 7
- From 54 to 34
- From 62 to 19
- From 64 to 60
- From 87 to 24
- From 93 to 73
- From 95 to 75
- From 98 to 79

### Ladders
- From 1 to 38
- From 4 to 14
- From 9 to 31
- From 21 to 42
- From 28 to 84
- From 51 to 67
- From 71 to 91
- From 80 to 100

## Changing the Number of Players

If you want to change the number of players during the game, click the "Change Players" button in the top left corner.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- LocalStorage for game state management

## Development

Feel free to modify or enhance this game! The code is structured as follows:

- `start.html` - Player selection screen
- `index.html` - Main game board
- `script.js` - Game logic
- `style.css` - Styling for the game
- `snake and ladder image/` - Directory containing game assets 