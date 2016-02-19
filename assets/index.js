/**
* Flowtap test
* https://www.flowtap.com/frontend-projecta1/folder1/d2.html
**/

/* global $, document, setTimeout, console */
(function() {
  /**
  * @event document ready
  * fires when the page render
  * create a 2 sec latency for the ajax call
  * assets/data.json loads via ajax
  **/
  $(document).ready(function() {

    var renderOrederArray = null;

    setTimeout(function() {
      $.ajax({url:'assets/data.json', cache: true}).done(function(data) {
        processData(data);
      }).fail(function() {
        console.error('data.json load failed');
      });
    }, 2000);

    /**
    * @method processData
    * processes the data after ajax response
    * @params data {Object}
    **/
    function processData(data) {
      $('#boxContainer').children().remove();
      var previousLabels = addLabel(data);
      renderOrederArray = setOrder(data);
      for(var i = 0 ; i < renderOrederArray.length ; i++) {
        var renderArrIndex = renderOrederArray[i];
        for(var j in data) {
          if(data.hasOwnProperty(j)) {
            var currIndex = parseInt(data[j].index);
            if(currIndex === renderArrIndex && previousLabels.indexOf(data[j].label) > -1) {
              initalDraw(data[j].index, data[j].label, data[j].style);
              var chooseDeleteIndex = previousLabels.indexOf(data[j].label);
              var actualDeleteIndex = previousLabels.splice(chooseDeleteIndex, 1);
              delete previousLabels[actualDeleteIndex];
              break;
            }
          }
        }
      }
      setUpInputEvent();
    }

    /**
    * @method setOrder
    * creates the numeric order and returns with the ordered array
    * @params data {Object}
    * @returns {Array}
    **/
    function setOrder(data) {
      function sortNumber(a, b) {
        return a - b;
      }
      var indexArr = [];
      for(var i in data) {
        if(data.hasOwnProperty(i)) {
          indexArr.push(parseInt(data[i].index));
        }
      }
      return indexArr.sort(sortNumber);
    }

    /**
    * @method addLabel
    * returns with the array of labels
    * @params data {Object}
    * @returns {Array}
    **/
    function addLabel(data) {
      var labelArr = [];
      for(var i in data) {
        if(data.hasOwnProperty(i)) {
          labelArr.push(data[i].label);
        }
      }
      return labelArr;
    }

    /**
    * @method initalDraw
    * adds the box elements to the DOM
    * @params index {Number}
    * @params label {String}
    * @params style {String}
    **/
    function initalDraw(index, label, style) {
      var input = '<input type="text" class="form-control" placeholder="input with some sort value" value="'+ index +'">';
      var spanInput = '<span class="containerLabel">'+ label + '</span>' + input;
      var boxElement = '<div id="'+ index +'" class="'+ style +' form-control">'+ spanInput + '</div>';
      $('#boxContainer').append(boxElement);
    }

    /**
    * @method setUpInputEvent
    * sets up the event listener for input fields
    **/
    function setUpInputEvent() {
      $('input').parent().removeClass('has-error');
      $('input').change(function() {
        var $thisInput = $(this);
        if($thisInput.val() === '') {
          $thisInput.siblings().animate({}, 500, function() {
            $thisInput.parent().addClass('has-error');
          });
        } else {
          $thisInput.parent().removeClass('has-error');
        }
      });
    }

    /**
    * @event click
    * click event for the #sort button
    * rerenders the boxes
    **/
    $('#sort').click(function() {
      var newData = [];
      var indexes = [];
      var labels = [];
      var styles = [];

      var changeOccurence = 0;
      var counter = 0;
      $.each($('input[type="text"]'), function(index, value) {
        if(renderOrederArray[counter] !== parseInt(value.value)) {
          changeOccurence++;
        }
        counter++;

        if(isNaN(value.value) === true || value.value === '') {
          indexes.push(-1);
        } else {
          indexes.push(value.value);
        }
      });
      $('#counter').html(changeOccurence);

      $.each($('.containerLabel'), function(index, value) {
        labels.push(value.innerHTML);
      });

      $.each($('.containerLabel').parent(), function(index, value) {
        styles.push(value.className);
      });

      for(var i = 0 ; i < indexes.length ; i++) {
        var newObject = {};
        newObject.index = indexes[i];
        newObject.label = labels[i];
        newObject.style = styles[i];
        newData.push(newObject);
      }

      processData(newData);
    });
  });
}());