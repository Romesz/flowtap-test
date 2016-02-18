/**
* Flowtap test
* https://www.flowtap.com/frontend-projecta1/folder1/d2.html
**/

/* global $, document, console */
(function() {
  $(document).ready(function() {

    var renderOrederArray = null;

    //setTimeout(function() {
      $.ajax({url:'assets/data.json', cache: true}).done(function(data) {
        processData(data);
      }).fail(function() {
        console.error('data.json load failed');
      });
    //}, 2000);

    function processData(data) {
      $('#boxContainer').children().remove();
      renderOrederArray = setOrder(data);
      for(var i = 0 ; i < renderOrederArray.length ; i++) {
        var renderArrIndex = renderOrederArray[i];
        for(var j in data) {
          if(data.hasOwnProperty(j)) {
            var currIndex = parseInt(data[j].index);
            if(currIndex === renderArrIndex) {
              initalDraw(data[j].index, data[j].label, data[j].style);
            }
          }
        }
      }
      setUpInputEvent();
    }

    function setOrder(data) {
      var indexArr = [];
      for(var i in data) {
        if(data.hasOwnProperty(i)) {
          indexArr.push(parseInt(data[i].index));
        }
      }
      return indexArr.sort();
    }

    function initalDraw(index, label, style) {
      var input = '<input type="text" class="form-control" placeholder="input with some sort value" value="'+ index +'">';
      var spanInput = '<span class="containerLabel">'+ label + '</span>' + input;
      var boxElement = '<div id="'+ index +'" class="'+ style +'">'+ spanInput + '</div>';
      $('#boxContainer').append(boxElement);
    }

    function setUpInputEvent() {
      $('input').change(function() {
        var $thisInput = $(this);
        if($thisInput.val() === '') {
          $thisInput.siblings().animate({}, 500, function() {
            $(this).addClass('.has-error .form-control');
          });
        }
      });
    }

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

        if(isNaN(value.value) === true) {
          indexes.push(-1);
        } else {
          indexes.push(value.value);
        }
      });
      $.each($('.containerLabel'), function(index, value) {
        labels.push(value.innerHTML);
      });
      $.each($('.containerLabel').parent(), function(index, value) {
        styles.push(value.className);
      });

      if(changeOccurence > 0) {
        $('#counter').html(changeOccurence);
      }

      for(var i = 0 ; i < indexes.length ; i++) {
        var newObject = new Object();
        newObject.index = indexes[i];
        newObject.label = labels[i];
        newObject.style = styles[i];
        newData.push(newObject);
      }

      processData(newData);
    });
  });
}());