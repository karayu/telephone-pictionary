Session.setDefault("assignment", null);

Template.main.helpers({
  assignment: function () {
    if (!Session.get("viewingGame"))
      return Session.get("assignment");
    return null;
  },
  // return the game we're viewing, if any.
  game: function () {
    if (Session.get("viewingGame"))
      return Games.findOne(Session.get("viewingGame"));
    return null;
  }, 
  // Define a helper function that will be truthy if we're logged in.
  loggedIn: function () {
    if (Meteor.userId())
      return true;
    return false;
  }
});

Meteor.autorun(function () {
  if (Meteor.userId() && !Session.get("viewingGame") && !Session.get("assignment")) {
    Meteor.call("getAssignment", function (err, res) {
      Session.set("assignment", res);
    });
  }
});

submitAnswer = function (answer) {
  var assignment = Session.get('assignment');
  if (assignment) {
    Meteor.call('submitAnswer', assignment._id, answer);
    Session.set('assignment', null);
  }
};


Template.sidebar.helpers({
  recentGames: function () {
    return Games.find({
      done: true,
      participants: Meteor.userId()
    });
  },

  firstPhrase: function () {
    var move = Moves.findOne(this.moves[0]);
    return move && move.answer;
  },

  gameActive: function () {
    return activeIfTrue(Session.equals("viewingGame", this._id));
  }, 

  // Define a helper function that will be truthy if we're logged in.
  loggedIn: function () {
    if (Meteor.userId())
      return true;
    return false;
  },

  playActive: function () {
    return activeIfTrue(!Session.get("viewingGame"));
  }
});

Template.sidebar.events({
  'click .selectGame': function (evt) {
    Session.set("viewingGame", this._id);
  },
  'click .playGame': function () {
    Session.set("viewingGame", null);
  }
});


Meteor.autorun(function () {
  // PHASE 7
  // inside this autorun, subscribe to:

  // * All games where this user is a participant and the game is done (see
  //   publish section in model.js)
  // * For all games we can see, all moves.
});
