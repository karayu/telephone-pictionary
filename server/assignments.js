GAME_LENGTH = 3;

// Meteor.methods sets up RPCs you can access with Meteor.call('methodName', args...)
Meteor.methods({
  // Return an assignment for the current user.
  getAssignment: function () {
    if (!Meteor.userId())
      throw new Meteor.Error(403, "Must be logged in to play");

    // Use mongo to try and find a move we're already assigned.

    // PHASE 6
    // Modify this to require that the move hasn't expired.
    var move = Moves.findOne({
      assignee: Meteor.userId(),
      answer: null
    });
    // If there's no such move, create one
    // * Assigned to us
    // * Expiring in 100 seconds
    // * With an answer of null so far
    // * Create an _id for it explicitly (why?)
    // * Extra credit: have an 'expires field that is equal to 100 seconds form now
    if (!move) {
      move = {
        assignee: Meteor.userId(),
        answer: null,
        _id: Random.id()
      };

      Moves.insert(move);
    }

    var game = Games.findOne({
      done: false,
      activeMove: null
      //participants: {$ne: Meteor.userId()}
    });

    if (game) 
      move.previous = game.moves[game.moves.length - 1];
    else
      game = Games.insert({
        _id: Random.id(),
        done: false,
        activeMove: null,
        participants: [],
        moves: []
      });

    move.game = game._id;

    Moves.update({_id: move._id}, {$set: {game: move.game, previous: move.previous}});
    Games.update({_id: game._id}, {$set: {activeMove: move._id}});
    

    // Here, we do some work to make it easier for the client to make decisions
    // based on their assigned move -- we augment the move object with the
    // answer from the previous move.  Note that this doesn't affect what's in
    // the database.
    if (move.previous) {
      var prevMove = Moves.findOne(move.previous);
      if (!prevMove)
        throw new Error("missing the previous move");
      if (typeof prevMove.answer === "string") {
        move.description = prevMove.answer;
      } else {
        move.picture = prevMove.answer;
      }
    } else {
      move.start = true;
    }
    return move;
  },
  // Answer a particular assigned move with the given answer
  submitAnswer: function (assignmentId, answer) {
    if (!Meteor.userId())
      throw new Meteor.Error(403, "Must be logged in to play");
    // This makes sure the assignmentId the client passed us is actually a
    // string.  Prevents mongo injection attacks.
    check(assignmentId, String);
    // Do more answer validation.
    var assignment = Moves.findOne(assignmentId);
    console.log("assignment is: " + JSON.stringify(assignment));
    //Extra credit: check to make sure that the assignment hasn't expired yet. 
    //i.e. current date is before the expiration date. 
    //If this is not the case, throw a 403 error

    var previous = Moves.findOne(assignment.previous);
    if (previous && typeof previous.answer === 'string')
      check(answer, Object);
    else
      check(answer, String);
    Moves.update(assignmentId, {$set: {answer: answer}});
    // Find the relevant game
    console.log("assignment.game is: " + assignment.game);
    var game = Games.findOne(assignment.game);
    console.log("game is: " + JSON.stringify(game));
    // Set the game to have no activeMove, and to be done if it has enough moves.
    var gameSetter = {activeMove: null};
    if (game.moves.length >= GAME_LENGTH - 1)
      gameSetter.done = true;
    // Also add this user to the participants, and this move to the list of moves.
    Games.update(game._id, {
      $set: gameSetter,
      $addToSet: {
        participants: Meteor.userId()
      },
      $push: {
        moves: assignmentId
      }
    });
  }
});

Meteor.setInterval(function () {
  // PHASE 6

  // Find all the moves that are expired but not answered.

  // Delete them from the Moves table.
  // Find the relevant game, and unset them as the activeMove
  // If the game is otherwise empty, just remove it from the Games table.
}, 10*1000);
