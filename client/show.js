Template.show.helpers({
  move: function () {
    return Moves.findOne(this.toString());
  }, 
  
  moves: function () {
    return this.moves;
  }
});

Template.showMove.helpers({
  picture: function () {
    return typeof this.answer === "object";
  }
});

Template.showMove.rendered = function () {
  var self = this;
  if (typeof self.data.answer === "object" && !self.canvas) {
    self.canvas = new fabric.StaticCanvas(self.data._id);
    self.canvas.setWidth(640);
    self.canvas.setHeight(480);
    self.canvas.loadFromJSON(self.data.answer);
    self.canvas.renderAll();
  }
};
