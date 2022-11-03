function AI(grid) {
  this.grid = grid;
}

//Heuristic function
AI.prototype.heuristic = function() {
  return this.grid.smoothness() * 0.1 + this.grid.monotonicity() + Math.log(this.grid.availableCells().length) *2.7 + this.grid.maxValue() 
};

// alpha-beta algorithm
AI.prototype.alphabeta = function(l, a, b, p, c) {
  var bestScore;
  var bestMove = -1;
  var result;

  // the player's turn
  if (this.grid.playerTurn) {
    bestScore = a;
    for (var d in [0, 1, 2, 3]) {
      var newGrid = this.grid.clone();
      if (newGrid.move(d).moved) {
        p++;
        if (newGrid.isWin()) {
          return { move: d, score: 10000, positions: p, cutoffs: c };
        }
        var newAI = new AI(newGrid);

        if (l == 0) {
          result = { move: d, score: newAI.heuristic() };
        } else {
          result = newAI.alphabeta(l-1, bestScore, b, p, c);
          if (result.score > 9900) { // win
            result.score--; // to slightly penalize higher limit from win
          }
          p = result.positions;
          c = result.cutoffs;
        }

        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = d;
        }
        if (bestScore > b) {
          c++
          return { move: bestMove, score: b, positions: p, cutoffs: c };
        }
      }
    }
  }

  else { // computer's turn
    bestScore = b;

    // try a 2 and 4 in each cell and measure how annoying it is with metrics from heuristic
    var candidates = [];
    var cells = this.grid.availableCells();
    var scores = { 2: [], 4: [] };
    for (var v in scores) {
      for (var i in cells) {
        scores[v].push(null);
        var cell = cells[i];
        var tile = new Tile(cell, parseInt(v, 10));
        this.grid.insertTile(tile);
        scores[v][i] = -this.grid.smoothness() + this.grid.islands();
        this.grid.removeTile(cell);
      }
    }

    // now just pick out the most annoying moves
    var maxScore = Math.max(Math.max.apply(null, scores[2]), Math.max.apply(null, scores[4]));
    for (var v in scores) { // 2 and 4
      for (var i=0; i<scores[v].length; i++) {
        if (scores[v][i] == maxScore) {
          candidates.push( { position: cells[i], value: parseInt(v, 10) } );
        }
      }
    }

    // alphabeta on each candidate
    for (var i=0; i<candidates.length; i++) {
      var position = candidates[i].position;
      var v = candidates[i].value;
      var newGrid = this.grid.clone();
      var tile = new Tile(position, v);
      newGrid.insertTile(tile);
      newGrid.playerTurn = true;
      p++;
      newAI = new AI(newGrid);
      result = newAI.alphabeta(l, a, bestScore, p, c);
      p = result.positions;
      c = result.cutoffs;

      if (result.score < bestScore) {
        bestScore = result.score;
      }
      if (bestScore < a) {
        c++;
        return { move: null, score: a, positions: p, cutoffs: c };
      }
    }
  }
  return { move: bestMove, score: bestScore, positions: p, cutoffs: c };
}

// performs a alphabeta and returns the best move
AI.prototype.getBestMove = function() {
  var start = (new Date()).getTime();
  var l = 3;
  do {
    var newBest = this.alphabeta(l, -10000, 10000, 0 ,0);
    if (newBest.move == -1) {
      rand = Math.floor(Math.random()*4)
      var newGrid = this.grid.clone();
      var newAI = new AI(newGrid);
      console.log(newAI)
      var bestScore = -10000;
      var _score = newAI.grid.smoothness() * 0.1 + newAI.grid.monotonicity() + Math.log(newAI.grid.availableCells().length) *2.7 + newAI.grid.maxValue() 
      return { move: rand, score:_score, postitions : 0 , c : 0 };
      break;
    } 
    else {
      best = newBest;
    }
    l++;
  } while ( (new Date()).getTime() - start < minSearchTime);
  return newBest
}


AI.prototype.translate = function(move) {
 return {
    0: 'up',
    1: 'right',
    2: 'down',
    3: 'left'
  }[move];
}
