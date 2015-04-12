(function() {
  var WIDTH = 500;
  var HEIGHT = 600;
  var STEPY =20;

  angular.module("slider", []);

  angular.module("slider").directive("slider", function($document, $timeout) {
    return {
      restrict: "E",
      scope: {
        model: "=",
        property: "@",
        step: "@"
      },
      replace: true,
      template: "<div class=\"slider-control\">\n<div class=\"slider\">\n</div>\n</div>",
      link: function(scope, element, attrs) {
        var getP, handles, i, mv, pTotal, setP, step, updatePositions, _fn, _i, _len, _ref;
        element = element.children();
        element.css('position', 'relative');
        handles = [];
        pTotal = 0;
        step = function() {
          if ((scope.step != null)) {
            return parseFloat(scope.step);
          } else {
            return 0;
          }
        };
        getP = function(i) {
          if (scope.property != null) {
            return scope.model[i][scope.property];
          } else {
            return scope.model[i];
          }
        };
        setP = function(i, p) {
          var s;
          s = step();
          if (s > 0) {
            p = Math.round(p / s) * s;
          }
          if (scope.property != null) {
            return scope.model[i][scope.property] = p;
          } else {
            return scope.model[i] = p;
          }
        };
        updatePositions = function() {
          var handle, i, p, pRunningTotal, x, _i, _len, _results;
          pTotal = scope.model.reduce(function(sum, item, i) {
            return sum + getP(i);
          }, 0);
          pRunningTotal = 0;
          _results = [];
          for (i = _i = 0, _len = handles.length; _i < _len; i = ++_i) {
            handle = handles[i];
            p = getP(i);
            pRunningTotal += p;
            x = pRunningTotal / pTotal * 100;
            _results.push(handle.css({
              left: x + "%",
              top: "-" + handle.prop("clientHeight") / 2 + "px"
            }));
          }
          return _results;
        };
        _ref = scope.model;
        _fn = function(mv, i) {
          var handle, startPleft, startPright, startX;
          if (i === scope.model.length - 1) {
            return;
          }
          handle = angular.element('<div class="slider-handle"></div>');
          handle.css("position", "absolute");
          handles.push(handle);
          element.append(handle);
          startX = 0;
          startPleft = startPright = 0;
          return handle.on("mousedown", function(event) {
            var mousemove, mouseup;
            mousemove = (function(_this) {
              return function(event) {
                return scope.$apply(function() {
                  var dp;
                  dp = (event.screenX - startX) / element.prop("clientWidth") * pTotal;
                  if (dp < -startPleft || dp > startPright) {
                    return;
                  }
                  setP(i, startPleft + dp);
                  setP(i + 1, startPright - dp);
                  return updatePositions();
                });
              };
            })(this);
            mouseup = function() {
              $document.unbind("mousemove", mousemove);
              return $document.unbind("mouseup", mouseup);
            };
            event.preventDefault();
            startX = event.screenX;
            startPleft = getP(i);
            startPright = getP(i + 1);
            $document.on("mousemove", mousemove);
            return $document.on("mouseup", mouseup);
          });
        };
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          mv = _ref[i];
          _fn(mv, i);
        }
        return scope.$watch("model", updatePositions, true);
      }
    };
  });

  angular.module("slider").controller("Ctrl", function($scope) {
    // Liana - added my code here
    $scope.addSegment = function() {
      if ($scope.segments == undefined) {
        $scope.segments = [];
      }
      var x1 = Math.round($scope.x1);
      var x2 = Math.round($scope.x2);
      $scope.segments.push([x1, x2]);
      // draw the segment on the segments canvas
      if ($scope.segmentsY == undefined) {
        $scope.segmentsY = STEPY;
      }
      drawSingleSegment([x1, x2], $scope.segmentsY, "segments");
      $scope.segmentsY += STEPY;
      console.log("add segment");
    };

    $scope.merge = function() {
      var merged = mergeArray($scope.segments);
      drawComputedSegments(merged, "merged");
    }

    $scope.sort = function() {
      var sorted = sortArray($scope.segments);
      drawComputedSegments(sorted, "merged");
    }

    $scope.mergeAndSort = function() {
      var merged = mergeArray($scope.segments);
      var sorted = sortArray(merged);
      drawComputedSegments(sorted, "merged");
    };

    $scope.resetAndClear = function() {
      $scope.segments = [];
      $scope.segmentsY = STEPY;
      resetCanvas("segments");
      resetCanvas("merged");
      console.log($scope.segments);
    };
    // end - Liana added my code here

    $scope.probs = [
      {
        p: .1
      }, {
        p: .5
      }, {
        p: .4
      }
    ];
    return $scope.otherProbs = [3, 3, 4];
  });

  // Liana - canvas functionality
  var scaleToCanvas = function(x) {
    return (x + 50) * 5;
  }

  var drawSingleSegment = function(tuple, y, name) {
    var cvs = document.getElementById(name);
    var ctx = cvs.getContext("2d");
    ctx.strokeStyle = "#777";
    ctx.beginPath();
    var x1 = scaleToCanvas(tuple[0]);
    var x2 = scaleToCanvas(tuple[1]);
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
    ctx.fillText(tuple[0], x1, y+12);
    ctx.fillText(tuple[1], x2, y+12);
  };

  var drawComputedSegments = function(computed, name) {
    var cvs = document.getElementById(name);
    var ctx = cvs.getContext("2d");
    resetCanvas(name);
    ctx.strokeStyle = "#777";
    var y = STEPY;
    ctx.beginPath();
    var x1;
    var x2;
    computed.forEach(function(tuple, index, arr) {
      x1 = scaleToCanvas(tuple[0]);
      x2 = scaleToCanvas(tuple[1]);
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.stroke();
      ctx.fillText(tuple[0], x1, y+12);
      ctx.fillText(tuple[1], x2, y+12);
      y += STEPY;
    });
  };

  var resetCanvas = function(name) {
    var c1 = document.getElementById(name);
    var ctx = c1.getContext("2d");
    ctx.clearRect(0, 0, c1.width, c1.height);
    // draw a vertical line at x=0
    ctx.strokeStyle = "#CCF";
    ctx.beginPath();
    ctx.moveTo(WIDTH/2, 0);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke();
  };

  var sortArray = function(arrOfTuples) {
    return arrOfTuples.sort(function(tuple1, tuple2) {return tuple1[0] === tuple2[0] ? tuple1[1] > tuple2[1] : tuple1[0] > tuple2[0];})
  };

  var mergeArray = function(arrOfTuples) {
    var result = [];
    arrOfTuples.forEach(function(tuple, index, arr) {
        var addTuple = true;
        result = result.map(function(sofarTuple) {
            var sorted = sortArray([sofarTuple, tuple]);
            if (sorted[0][1] + 1 >= sorted[1][0]) {
                // overlap! merge the tuple - dont add it at the end
                addTuple = false;
                return [Math.min(sorted[0][0],sorted[1][0]),Math.max(sorted[0][1], sorted[1][1])];
            } else {
                return sofarTuple;
            }
        });
        if (addTuple) {
            result.push(tuple);
        }
    });
    return result;
  };

  // module/app initialization
  angular.module("slider").run(['$rootScope', function($rootScope) {
    resetCanvas("segments");
    resetCanvas("merged");
  }]);

}).call(this);
