/**
 * @fileoverview Main js
 * @author Jakub
 */

/**
 * App
 */
var App = function($, window) {

  /**
   * shuffleArray - randomize array element order in place using fishe-yates suffle algorithm
   *
   * @param  {Array} array Array to be suffled
   * @return {Array}       Shuffled array
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

  function Storage(app) {
    this.app = app;
  }

  Storage.prototype.init = function() {

  };
    /**
     * saveToStorage - save an object structure to storage under a key
     *
     * @param  {string} key DB key
     * @param  {object} data Data object=
     */
  Storage.prototype.saveToStorage = function(key, data) {
    var stringData;
    try {
      stringData = JSON.stringify(data);
    } catch (err) {
      return err;
    }
    localStorage.setItem(key, stringData);
  };

  Storage.prototype.getFromStorage = function(key) {
    var data = localStorage.getItem(key);
    if (data === null) {
      return null;
    }
    try {
      return JSON.parse(data);
    } catch (err) {
      return err;
    }
  };

  Storage.prototype.keyExists = function(key, name) {
    console.log(key, name)
    var data = this.getFromStorage(key);
    if (data && data[name]) {
      return true;
    } else {
      return false;
    }
  };

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

  function EventHandler(app) {
    this.app = app;
  }

  EventHandler.prototype.init = function(){
    var self = this;
    $("#saveNames").unbind();
    $("#clearList").unbind();
    $("#deleteList").unbind();
    $(".name > input").unbind();
    $("#saved-lists").unbind();

    $("#saveNames").click(function() {
      self.saveNames();
    });

    // Name input handler
    $(".name > input").on("keydown", function(event) {
      var $this = $(this);
      if ($this.val() !== "" && (event.which === 13 || event.which === 9)) {
        event.preventDefault();
        var row = $this.parent();
        var newRow = self.app.gui.appendNewNameRow(row, true);
      }
      if ($this.val() === "" && event.which === 8) {
        event.preventDefault();
        var index = $(".name > input").index(this);
        if (index === 0) return;
        $this.parent().prev().find("input").focus();
        $this.parent().remove();
      }
    });
    $(".name > input").on("blur", function(event) {
      var $this = $(this);
      var allNames = $(".name > input");
      var index = allNames.index(this);
      var length = allNames.size();
      if ($this.val() === "" && index + 1 !== length) {
        $this.parent().remove();
      }
    });

    $("#saved-lists").change(function(){
      var value = $(this).find("option:selected").val();
      if (value) self.app.gui.renderList(value);
    });


    $("#clearList").click(function(){
      self.app.gui.clearList();
    });

    $("#deleteList").click(function(){
      self.app.gui.deleteList();
    });
  };

  EventHandler.prototype.saveNames = function() {
    var self = this;
    var savedData = this.app.storage.getFromStorage("savedClasses");
    if (savedData === null) {
      savedData = {};
    }
    var names = [];
    $(".name > input").each(function() {
      var val = $(this).val();
      if (val) names.push(val);
    });
    this.app.gui.askUser("Name of the class", function(value) {
      if (value === "") {
        self.app.gui.showError("You have to write some name.");
        return false;
      } else {
        if(self.app.storage.keyExists("savedClasses", value)) {
            self.app.gui.showError("The name '"+value+"' is already used.");
            return false;
        }
        self.app.gui.hideError();
        return true;
      }
    }, function(value) {
      savedData[value] = names;
      this.app.storage.saveToStorage("savedClasses", savedData);
      this.app.gui.updateSavedList();
    });

  };

  function GUI(app) {
    this.app = app;
    this.currentList = "";
  }

  GUI.prototype.init = function(){
    this.updateSavedList();
  };

  GUI.prototype.askUser = function(question, check, cb) {
    var self = this;
    var popup = $(".dialogue-bg");

    var cleanup = function() {
      popup.find("input").val("");
      self.hideError();
      popup.fadeOut();
      popup.find('button').unbind('click');
    };

    popup.find("h4").html(question);
    popup.fadeIn();
    popup.find("input").focus();
    popup.find("#cancel").click(function() {
      cleanup();
    });
    popup.find("#saveNamesConfirm").click(function() {
      var input = popup.find("input");
      var value = input.val();
      if (check(value)) {
        cb(value);
        cleanup();
      }
    });
  };

  GUI.prototype.showError = function(text) {
    var title = $(".dialogue-bg").find("h4");
    var errorBox;
    if (title.next().hasClass('bg-danger')) {
      errorBox = title.next();
    } else {
      errorBox = title.after("<p class='bg-danger'></p>").next();
    }
    errorBox.html(text);
  };

  GUI.prototype.appendNewNameRow = function(appendTo, focus) {
    if (typeof focus === "undefined") focus = false;
    var newRow = appendTo.clone(true).insertAfter(appendTo);
    var input = newRow.find("input").val("");
    if (focus) input.focus();
    return newRow;
  };

  GUI.prototype.hideError = function() {
    $(".dialogue-bg").find(".bg-danger").remove();
  };

  GUI.prototype.updateSavedList = function() {
    var classes = this.app.storage.getFromStorage('savedClasses');
    var html = "";
    for (var i in classes) {
      html += '<option value="' + i + '">' + i + '</option>';
    }
    if (html) {
      html = '<option seleted value=""> Select a class</options>' + html;
      $("#saved-lists").html(html);
    } else {
      $("#saved-lists").html('<option disabled seleted> No classes saved</options>');
    }
  };

  GUI.prototype.clearList = function(){
    $('#names').find(".name").remove();
    $('#names').prepend('<div class="name"><input class="name-input" type="text" placeholder="Name"></div>');
  };

  GUI.prototype.renderList = function(listName){
    var classes = this.app.storage.getFromStorage('savedClasses');
    this.currentList = listName;
    var list = classes[listName];
    var html = "";
    for (var i in list) {
      html += '<div class="name"><input class="name-input" type="text" placeholder="Name" value="'+list[i]+'"></div>';
    }
    $('#names').find(".name").remove();
    $('#names').prepend(html);
    this.app.handler.init();

  };

  GUI.prototype.deleteList = function(){

    if(this.currentList && this.app.storage.keyExists("savedClasses", this.currentList)) {
      console.log(this.currentList,"asdfS")
      this.askUser("You are about to delete the list '" + this.currentList + "'", function(ok){

      });
    }
  };

  function App() {
    this.handler = new EventHandler(this);
    this.storage = new Storage(this);
    this.gui = new GUI(this);

    this.handler.init();
    this.storage.init();
    this.gui.init();
  }

  $(document).ready(function() {
    window.app = new App();
  });
};


App($, window);
