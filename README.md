# Snake

A web version of the game Snake, created using HTML5, CSS3 and JavaScript.

## Usage
Click on the start button and use the arrow keys to move the snake and eat the food
blocks, avoiding collisions with the snake itself. The snake can move through the walls.

## Animation
The animation of the snake is created with JavaScript and CSS. Two HTML
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

The auto mode can be selected by clicking on the respective button before the game starts. The game mode can also be changed when the game has already started.

A breadth-first search is used to find the shortest path to the food block and to obtain the sequence of moves to reach it. The position of the snake's head is stored in a set in order to keep the time and space complexity of the search under control. Even tough it  does not in itself represent a visited state since the position of the other blocks should also be considered, it works well in most practical cases.

## Example

The game can be played at http://snake-game-js-project.s3-website.eu-central-1.amazonaws.com
