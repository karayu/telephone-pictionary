Meteor.autorun(function () {
  Meteor.subscribe('gamesForUser');
});

Meteor.autorun(function () {
  Games.find().forEach(function (game) {
    Meteor.subscribe('movesForGame', game._id);
  });
});

Template.main.helpers({
  loggedIn: function () {
    return Meteor.userId();
  },

  assignment: function () {
    if (!Session.get("viewingGame"))
      return Session.get('assignment');
    return null;
  },

  game: function () {
    if (Session.get("viewingGame"))
      return Games.findOne(Session.get("viewingGame"));
    return null;
  }
});

Meteor.autorun(function () {
  if (Meteor.userId() &&
      !Session.get("viewingGame") &&
      !Session.get("assignment")) {
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
  loggedIn: function () {
    return Meteor.userId();
  },

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


