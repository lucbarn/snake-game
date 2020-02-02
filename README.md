# snake-game

A web version of the game Snake, created using HTML5, CSS3 and JavaScript (ES6).

## Usage
Click on the start button and use the arrow keys to move the snake and eat the food
blocks, avoiding collisions with the snake itself. The snake can move through the walls.

## Animation
The animation of the snake is achieved through a mix of JavaScript and CSS. Two HTML
divs serve as containers for the snake's tail and head that shrink and expand,
respectively. The following sequence of steps is used to create the animation:

1) The (empty) tail is moved to the old tail's position.

2) The tail's background is filled by removing its class so that it falls back
to its default style.

3) The last block of the snake is moved to the new head's position.

4) The head's background is emptied by removing its class.

5) The head is moved to its new position.

6) Finally, tail's and head's CSS animations are triggered.

If the snake eats a food block, the animation starts from point 4, since the tail
does not move and a new block is created in the head's position.

## Auto mode

The auto mode can be selected by clicking on the respective button. The game mode can be selected before the game starts but it can also be changed when the game has already started.

A breadth-first search is used to find the shortest path to the food block. The
sequence of moves is then used to reach the position of the food block.
