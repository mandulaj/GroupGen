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

function arraySum(array) {
  var total = 0;
  for (var i in array) {
    total += array[i];
  }
  return total;
}

function Grouper(peopleList) {
  this.groups = []
  this.peopleList = peopleList;
}

Grouper.prototype.shuffle = function() {
  this.peopleList = shuffleArray(this.peopleList);
}

Grouper.prototype.addPerson = function(person) {
  this.peopleList.push(person)
  return this.peopleList.length;
}
Grouper.prototype.removePerson = function(person) {
  var index = this.peopleList.indexOf(person);
  if (index == -1) return -1;
  this.peopleList.splice(index, 1);
}

Grouper.prototype.partition = function(length) {
  var result = [];
  for (var i = 0; i < this.length; i++) {
    if (i % length === 0) result.push([]);
    result[result.length - 1].push(this[i]);
  }
  return result;
}


Grouper.prototype.genAuto = function(groupNum) {

}

Grouper.prototype.genByGroupNum = function(groupNum) {

}

Grouper.prototype.genByPplNum = function(pplNum) {

}
