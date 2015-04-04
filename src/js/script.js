/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function saveToStorage(key, data) {
  var stringData;
  try {
    stringData = JSON.stringify(data);
  } catch (err) {
    return err;
  }
  localStorage.saveItem(key, stringData)
}

function getFromStorage(key) {
  var data = localStorage.getItem(key);
  if (data === null) {
    return null;
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    return err;
  }
}

function arraySum(array) {
  var total = 0;
  for (var i in array) {
    total += array[i];
  }
  return total;
}

function Grouper(peopleList) {
  this.groups = [];
  this.peopleList = peopleList;
}

Grouper.prototype.shuffle = function() {
  this.peopleList = shuffleArray(this.peopleList);
};

Grouper.prototype.addPerson = function(person) {
  this.peopleList.push(person);
  return this.peopleList.length;
};
Grouper.prototype.removePerson = function(person) {
  var index = this.peopleList.indexOf(person);
  if (index == -1) return -1;
  this.peopleList.splice(index, 1);
};

Grouper.prototype.partition = function(length) {
  var result = [];
  for (var i = 0; i < this.length; i++) {
    if (i % length === 0) result.push([]);
    result[result.length - 1].push(this[i]);
  }
  return result;
};


Grouper.prototype.genAuto = function(groupNum) {

};

Grouper.prototype.genByGroupNum = function(groupNum) {

};

Grouper.prototype.genByPplNum = function(pplNum) {

};

function EventHandler() {
  var self = this;
  $("#saveNames").click(function(){
    self.saveNames();
  });

  $(".name > input").on("keydown", function(event){
    var $this = $(this)
    if($this.val() !== "" && (event.which === 13 || event.which === 9)) {
      event.preventDefault();
      var row = $this.parent();
      var newRow = row.clone(true).insertAfter(row);
      var newInput = newRow.find("input")
      newInput.val("")
      newInput.focus();
    }
    if($this.val() === "" && event.which === 8) {
      event.preventDefault()
      var index = $(".name > input").index(this);
      if (index === 0) return;
      $this.parent().prev().find("input").focus();
      $this.parent().remove();
    }
  });
  $(".name > input").on("blur", function(event){
    var $this = $(this);
    var allNames = $(".name > input")
    var index = allNames.index(this);
    var length = allNames.size();
    if($this.val() === "" && index+1 !== length) {
      console.log("removing")
      $this.parent().remove();
    }
  });

}

EventHandler.prototype.saveNames = function() {
  var savedData = getFromStorage("savedClasses");
  if (savedData == null) {
    savedData = {
      classes: []
    }
  }
  var names = []
  $(".name > input").each(function(){
    names.push($(this).val())
  });
  var className = this.askUser("Name of the class");

};

EventHandler.prototype.askUser = function(question){
  var popup = $(".dialogue-bg");
  popup.find("h4").html(question);
  popup.show();
  console.log("asdfa")
};

$(document).ready(function() {
  var handler = new EventHandler();
});
