Template.start.events({
  'submit, click #done': function (evt, templ) {
    evt.stopPropagation();
    evt.preventDefault();
    // PHASE 5
    // use the template to find the '#phrase' input
    // if it has a value, submit that.
    var answer = $('#phrase').val();
    if (answer) {
      submitAnswer(answer);
      $('#phrase').empty();
    }

    // note: check the submitAnswer helper function in main.js
  }
});
