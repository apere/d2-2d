// **
// * Function to initialize an affinity compare chart (minimal: two circles)
// * 
// * Params: 
// *** sketchID - The ID of the element to contain this chart
// *** theData - The dataset we want to graph
// **
function makeCompareTwoChart(sketchID, theData) {
  data = [];
  for (var i = 0; i < theData.length; i++) {
    var temp = {};
    for (key in theData[i]) {
      temp[key] = theData[i][key];
    }
    data.push(temp);
  }

  var widthn = $(sketchID).innerWidth() - 20;
  var width = widthn + 'px';
  var heightn = 150;
  var height = heightn + 'px';
  var margin = {
    top: 0,
    bottom: 30,
    left: 15,
    right: 15
  };
  
  
  var pointPadding = 10;

  var xScale = d3.scale.linear().range([margin.left, widthn - margin.right]);
  var sizeScale = d3.scale.linear().range([5, d3.min([(widthn - margin.left - margin.right) / 2 - pointPadding, (heightn - margin.top - margin.bottom) / 2 - pointPadding])]);

  xScale.domain([0, data.length]);
  sizeScale.domain([0, d3.max(data, function (d) {
    return d.value;
  })]);

  var pointOffset = (xScale(0) + xScale(1)) / 2;
  
  // **
  // * function for setting the y Value of a point (always the same value)
  // **
  function yValue() {
    return ((heightn - margin.bottom - margin.top) / 2) + margin.top;
  }
  
  // **
  // * function for setting the x Value of a point
  // *
  // * Params: 
  // *** i - The index of point
  // **
  function xValue(i) {
    return xScale(i) + pointOffset;
  }

  // **
  // * function for setting the size of a point
  // *
  // * Params: 
  // *** i - The index of point
  // **
  function size(i) {
    return sizeScale(data[i].value);
  }


  var svg = d3.select(sketchID + " .viz-content")
    .append("svg")
    .attr('width', width)
    .attr('height', height);
  
  // **
  // * Create first point
  // **
  var firstPoint = svg.append('g')
    .attr('class', 'first-point');

  firstPoint.append('circle')
    .attr('r', 0)
    .attr('cx', xValue(0))
    .attr('cy', yValue())
    .attr('opacity', 0)
    .transition()
    .duration(1050)
    .ease('bounce')
    .attr('r', size(0))
    .attr('opacity', 1);

  firstPoint.append('text')
    .text(data[0].name)
    .attr('text-anchor', 'middle')
    .attr('x', xValue(0))
    .attr('y', yValue(0) + size(0) * 1.6);

  
  // **
  // * Create Second Point
  // **
  var secondPoint = svg.append('g')
    .attr('class', 'second-point');

  secondPoint.append('circle')
    .attr('r', 0)
    .attr('cx', xValue(1))
    .attr('cy', yValue())
    .attr('opacity', 0)
    .transition()
    .duration(1050)
    .ease('bounce')
    .attr('r', size(1))
    .attr('opacity', 1);

  secondPoint.append('text')
    .text(data[1].name)
    .attr('text-anchor', 'middle')
    .attr('x', xValue(1))
    .attr('y', yValue() + size(0) * 1.6);
}