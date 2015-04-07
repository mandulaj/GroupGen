(function($, window) {

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
    console.log(stringData);
    localStorage.setItem(key, stringData);
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

  function EventHandler(app) {
    var self = this;
    this.app = app;

    $("#saveNames").click(function() {
      self.saveNames();
    });


    function appendNewNameRow(appendTo, focus) {
      if (typeof focus === "undefined") focus = false;
      var newRow = appendTo.clone(true).insertAfter(appendTo);
      var input = newRow.find("input").val("");
      if (focus) input.focus();
      return newRow;
    }

    // Name input handler
    $(".name > input").on("keydown", function(event) {
      var $this = $(this);
      if ($this.val() !== "" && (event.which === 13 || event.which === 9)) {
        event.preventDefault();
        var row = $this.parent();
        var newRow = appendNewNameRow(row, true);
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
        console.log("removing");
        $this.parent().remove();
      }
    });

  }

  EventHandler.prototype.saveNames = function() {
    var self = this;
    var savedData = getFromStorage("savedClasses");
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
        self.app.gui.hideError();
        return true;
      }
    }, function(value) {
      savedData[value] = names;
      saveToStorage("savedClasses", savedData);
    });

  };

  function GUI(app) {
    this.app = app;
  }

  GUI.prototype.askUser = function(question, check, cb) {
    var self = this;
    var popup = $(".dialogue-bg");

    function cleanup() {
      popup.find("input").val("");
      self.hideError();
      popup.fadeOut();
      popup.find('button').unbind('click');
    }

    popup.find("h4").html(question);
    popup.fadeIn();
    popup.find("input").focus();
    popup.find("#cancel").click(function() {
      cleanup();
    });
    popup.find("#saveNamesConfirm").click(function() {
      var input = popup.find("input");
      var value = input.val();
      console.log(value, input);
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

  GUI.prototype.hideError = function() {
    $(".dialogue-bg").find(".bg-danger").remove();
  };

  function App() {
    this.handler = new EventHandler(this);
    this.gui = new GUI(this);
  }

  $(document).ready(function() {
    window.app = new App();
  });
})($, window);
