var timerDep = new Tracker.Dependency();

Template.timer.helpers({
	timeLeft: function () {
	  return "TIMER";
	  // PHASE 6
	  // Depend on the timer dependency so we rerun whenever it's changed.
	  // Calculate the time in seconds left on the current assignment.

	  // If the current assignment has expired, set the 'assignment' session
	  // variable back to null.

	  // Return the time left.
	}
});

	

Meteor.setInterval(function () {
  // Tell the dependency that it has changed.
}, 500);
