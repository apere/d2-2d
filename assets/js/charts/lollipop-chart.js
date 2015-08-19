// ****************
// *	This file makes a basic lollipop bar chart
// ****************
$( document ).ready(function() {

	
	function windowResized() {
		$('.viz-content').html('');
		makeBasicLine('#line-chart-1', myData);
	}
	

	
	$(window).resize(function () {
    waitForFinalEvent(function(){
      windowResized()
    }, 500, "some unique string");
	});
});

var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();