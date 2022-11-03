# 2048_AI_Player
Playing 2048 Game using Alpha/Beta Algorithm!

![Uploading ElegantSaneKingbird-size_restricted.gif]()


The main of the game is to slide tiles on a grid, to combine tiles of the same values and thus create a tile bearing the number 2048.
However, the player can continue to play after this objective has been reached to make the best possible score.

Solving this game is an interesting problem because it has a random component.
It is impossible to correctly predict not only where each new tile will be placed, but also whether it will be a 2 or a 4. 

We can see the game as a game with opponent; the man vs the computer

At any given time, there are only four possible moves we can make. Sometimes, some of these movements have no impact on the stage and are therefore not worth doing.

## So the challenge is then to determine which of these four movements will have the best long-term result.

The solution proposed is Alpha/Beta algorithm.Alpha-Beta pruning is not actually a new algorithm, rather an optimization technique for minimax algorithm. It reduces the computation time by a huge factor. This allows us to search much faster and even go into deeper levels in the game tree. It cuts off branches in the game tree which need not be searched because there already exists a better move available. It is called Alpha-Beta pruning because it passes 2 extra parameters in the minimax function, namely alpha and beta.
Let’s define the parameters alpha and beta. 
Alpha is the best value that the maximizer currently can guarantee at that level or above. 
Beta is the best value that the minimizer currently can guarantee at that level or above.
