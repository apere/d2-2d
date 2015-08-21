// **
// * Function to initialize an Affinity chart that compares two topics (circles connected by horizontal line)
// * 
// * Params: 
// *** sketchID - The ID of the element to contain this chart
// *** theData - The dataset we want to graph
// *** compareIndexes - the indexes of the two points that we want to compare in theData
// **
function makeCircleLineCompare(sketchID, theData, compareIndexes, pHeight) {
  var startDate = new Date(theData.startDate);
  var endDate = new Date(theData.endDate);
  var origData = theData.affinityInfo;
  var data = [];

  for (var i = 0; i < compareIndexes.length; i++) {
    data.push(origData[i]);
  }

  var widthn = $(sketchID).innerWidth() - 20;
  var width = widthn + 'px';
  var heightn = pHeight;
  var height = heightn + 'px';
  var margin = {
    top: 20,
    bottom: 25,
    left: 205,
    right: 25
  };
  
  if(pHeight === undefined) {
    pHeight = 200; 
  }
  
  var maxPercent = 0;
  var circRadius = 5;

  var xScale = d3.scale.linear().domain([0, 100]).range([margin.left, widthn - margin.right]);
  var yScale = d3.scale.linear().domain([data.length - 1, 0]).range([heightn - margin.bottom, margin.top + circRadius * 3]);
  var relScale = d3.scale.linear().domain([0, 100]).range([0.1, 1]);
  var sizeScale = d3.scale.linear().domain([0, 100]).range([5, 20]);

  var svg = d3.select(sketchID + " .viz-content")
    .append("svg")
    .attr('width', width)
    .attr('height', height);
  
  // **
  // * Creating Axes
  // **
  var axes = svg.append('g')
    .attr('class', 'axes');

  axes.append('line')
    .classed('left-axis', true)
    .attr('x1', xScale(0))
    .attr('x2', xScale(0))
    .attr('y1', yScale(0) - circRadius * 2)
    .attr('y2', yScale(data.length - 1) + circRadius * 2);

  axes.append('text')
    .classed('left-axis', true)
    .attr('x', xScale(0))
    .attr('y', yScale(0) - circRadius * 3)
    .attr('text-anchor', 'end')
    .text('0%');

  axes.append('line')
    .classed('middle-axis', true)
    .attr('x1', xScale(maxPercent / 2))
    .attr('x2', xScale(maxPercent / 2))
    .attr('y1', yScale(0) - circRadius * 2)
    .attr('y2', yScale(data.length - 1) + circRadius * 2);

  axes.append('text')
    .classed('middle-axis', true)
    .attr('x', xScale(maxPercent / 2))
    .attr('y', yScale(0) - circRadius * 3)
    .attr('text-anchor', 'middle')
    .text(function (d, i) {
      return (maxPercent / 2).toFixed(1) + '%';
    });

  axes.append('line')
    .classed('right-axis', true)
    .attr('x1', xScale(maxPercent))
    .attr('x2', xScale(maxPercent))
    .attr('y1', yScale(0) - circRadius * 2)
    .attr('y2', yScale(data.length - 1) + circRadius * 2);

  axes.append('text')
    .classed('right-axis', true)
    .attr('x', xScale(maxPercent))
    .attr('y', yScale(0) - circRadius * 3)
    .attr('text-anchor', 'start')
    .html(function (d, i) {
      return (maxPercent).toFixed(1) + '%';
    });

  
  // **
  // * Creating g element for each point
  // **
  var points = svg.append('g')
    .selectAll('g')
    .data(data);

  var lines, allTwitter, myMonitor, labels;
  setupPoints();
  
  // **
  // * Adding Axis Text
  // **
  axes.append('text')
    .text('twitter')
    .attr('text-anchor', 'middle')
    .attr('x', xValueTw(data[data.length - 1]))
    .attr('y', heightn - margin.bottom / 4);

  axes.append('text')
    .text('my monitor')
    .attr('text-anchor', 'middle')
    .attr('x', xValueMe(data[data.length - 1]))
    .attr('y', heightn - margin.bottom / 4);

  
  // **
  // * Function to calculate a point's y-value
  // * 
  // * Params: 
  // *** d - The data bound to the point
  // *** i - the point's index
  // **
  function yValue(d, i) {
    return yScale(i);
  }
  
  // **
  // * Function to calculate my monitor's point's x-value
  // * 
  // * Params: 
  // *** d - The data bound to the point
  // *** i - the point's index
  // **
  function xValueMe(d, i) {
    return xScale(d.percentInMonitor);
  }
  
  
  // **
  // * Function to calculate all of twitter's point's x-value
  // * 
  // * Params: 
  // *** d - The data bound to the point
  // *** i - the point's index
  // **
  function xValueTw(d, i) {
    return xScale(d.percentOnTwitter);
  }
  
  // **
  // * Function to calculate the x1-value of a line (touching my monitor's point)
  // * 
  // * Params: 
  // *** d - The data bound to the point
  // *** i - the point's index
  // **
  function lineXValueMe(d, i) {
    if (d.percentInMonitor > d.percentOnTwitter) {
      return xScale(d.percentInMonitor) - 5;
    } else {
      return xScale(d.percentInMonitor) + 5;
    }
  }
  
  // **
  // * Function to calculate the x2-value of a line (touching all of twitter's point)
  // * 
  // * Params: 
  // *** d - The data bound to the point
  // *** i - the point's index
  // **
  function lineXValueTw(d, i) {
    if (d.percentInMonitor > d.percentOnTwitter) {
      return xScale(d.percentOnTwitter) + 5;
    } else {
      return xScale(d.percentOnTwitter) - 5;
    }
  }

  
  // **
  // * Function to update all points (exit, enter, and update)
  // * 
  // **
  function setupPoints() {

    // **
    // * Transition and remove points associated with data that has been removed
    // **
    var pExit = points.exit();

    pExit.selectAll('line')
      .transition()
      .duration(300)
      .attr('x1', margin.left);

    pExit.selectAll('circle')
      .transition()
      .duration(300)
      .attr('cx', margin.left);

    pExit.selectAll('text')
      .transition()
      .duration(300)
      .attr('opacity', 0);

    pExit.transition()
      .delay(300)
      .duration(0)
      .remove();

    
    // **
    // * Add Points associated with new data
    // **
    var pEnter = points.enter()
      .append('g')
      .attr('class', 'datum')
      .each(function (d, i) {
        if (d.percentInMonitor > maxPercent) {
          maxPercent = d.percentInMonitor;
        }
        if (d.percentOnTwitter > maxPercent) {
          maxPercent = d.percentOnTwitter;
        }
      })
      .on('click', function (d, i) {
        console.log(d);
      })
      .on('mouseover', function (d, i) {
        // do something?
      })
      .on('mouseleave', function (d, i) {
        // do something?
      });

    
    // **
    // * Update scales & axes for new data
    // **
    xScale.domain([0, maxPercent]);
    sizeScale.domain([0, maxPercent]);

    var leftAxis = d3.selectAll(sketchID + ' line.left-axis');
    var leftAxisText = d3.selectAll(sketchID + ' text.left-axis');

    leftAxis.attr('x1', xScale(0))
      .attr('x2', xScale(0));
    leftAxisText.attr('x', xScale(0));

    var middleAxis = d3.selectAll(sketchID + ' line.middle-axis');
    var middleAxisText = d3.selectAll(sketchID + ' text.middle-axis');

    middleAxis.attr('x1', function (d) {
        return xScale(maxPercent / 2)
      })
      .attr('x2', function (d) {
        return xScale(maxPercent / 2)
      });

    middleAxisText
      .attr('x', function (d) {
        return xScale(maxPercent / 2);
      })
      .text(function (d, i) {
        return (maxPercent / 2).toFixed(1) + '%';
      });

    var leftAxis = d3.selectAll(sketchID + ' line.left-axis');
    var leftAxisText = d3.selectAll(sketchID + ' text.left-axis');

    leftAxis.attr('x1', xScale(maxPercent))
      .attr('x2', xScale(maxPercent));

    leftAxisText.attr('x', xScale(maxPercent))
      .html(function (d, i) {
        return (maxPercent).toFixed(1) + '%';
      });
    

    // **
    // * Adding visible elements to new points
    // **
    pEnter.append('line')
      .attr('x1', margin.left)
      .attr('y1', yValue)
      .attr('x2', margin.left)
      .attr('y2', yValue);

    pEnter.append('circle')
      .attr('class', 'monitor-point')
      .attr('r', circRadius)
      .attr('cx', margin.left)
      .attr('cy', yValue)
      .on('mouseover', function (d, i) {
        // do something?
      })
      .on('mouseleave', function (d, i) {
        // do something?
      });

    pEnter.append('circle')
      .attr('class', 'twitter-point')
      .attr('r', circRadius)
      .attr('cx', margin.left)
      .attr('cy', yValue)
      .on('mouseover', function (d, i) {
        // do something?
      })
      .on('mouseleave', function (d, i) {
        // do something?
      });

    pEnter.append('text')
      .text(function (d, i) {
        return d.name;
      })
      .attr('text-anchor', 'end')
      .attr('x', margin.left - 20)
      .attr('y', yValue)
      .attr('class', 'label');


    // **
    // * Update visible elements to final state
    // **
    lines = d3.selectAll(sketchID + ' .datum line');
    lines.transition()
      .delay(50)
      .duration(700)
      .ease('elastic')
      .attr('x1', lineXValueMe)
      .attr('x2', lineXValueTw);


    myMonitor = d3.selectAll(sketchID + ' .datum .monitor-point');
    myMonitor.transition()
      .delay(50)
      .duration(750)
      .ease('elastic')
      .attr('cx', xValueMe);

    allTwitter = d3.selectAll(sketchID + ' .datum .twitter-point');
    allTwitter.transition()
      .delay(50)
      .duration(750)
      .ease('elastic')
      .attr('cx', xValueTw);

    labels = d3.selectAll(sketchID + ' .datum .label');
    labels.attr('y', yValue);
  }

}