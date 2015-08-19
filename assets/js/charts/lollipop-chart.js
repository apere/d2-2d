// ****************
// *	This file makes a basic lollipop bar chart
// ****************
// **
// * Function to initialize a volume chart (lollipop charts) of averages (examples are posts/day of week and posts/hour of day)
// * note: this is a simplier version of the other lollipop volume chart makeVol().
// * 
// * Params: 
// *** sketchID - The ID of the element to contain this chart
// *** theData - The dataset we want to graph
// *** chartTitle - The title of the hart
// *** tickMod - Tick Interval (e.g. 1 = every tick, 2 = every other tick, etc.)
// *** tooltipText - The sub text of the tooltips
// **
function makeLollipopChart(sketchID, theData, chartTitle, tickMod, tooltipText) {
  var myData = [];
  var temp = {};
  var xTicks = [];
  var xTickValues = [];
  
  for (var i = 0; i < theData.length; i++) {
    temp = {};
    for (key in theData[i]) {
      temp[key] = theData[i][key];
    }
    myData.push(temp);
    xTicks.push(theData[i].key);
    if (i % tickMod === 0) {
      xTickValues.push(theData[i].key);
    }
  }

  var widthn = $(sketchID).innerWidth() - 20;
  var width = widthn + 'px';
  var heightn = 450;
  var height = heightn + 'px';
  var margin = {
    top: 95,
    bottom: 60,
    left: 15,
    right: 15
  };

  var clickedInfo = {};

  // **
  // * Initialize Scales
  // **
  var xScale = d3.scale.ordinal().domain(xTicks).rangePoints([margin.left, widthn - margin.right]);
  var yScale = d3.scale.linear().domain([0, 100]).range([margin.top, heightn - margin.bottom]);
  var largeOpacityScale = d3.scale.linear().domain([0, 100]).range([.4, .7]);
  var smallOpacityScale = d3.scale.linear().domain([0, 100]).range([.05, .3]);


  var sketch1 = d3.select(sketchID + " .viz-content")
    .append("svg")
    .attr('width', width)
    .attr('height', height);

  var titleArea = sketch1.append('g')
    .attr('class', 'hours-title');

  var axes = sketch1.append('g')
    .attr('class', 'axes');

  var maxDocs = 0;
  var minDocs = myData[0].avg;
  var circRadius = 3;

  var pointsHover = d3.selectAll(sketchID + ' .datum.circle-points'),
    points, pHoverEnter;

  var pointLayer = sketch1.append('g').attr('class', 'point-layer');

  // **
  // * Axes
  // **
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

  axes.append('g')
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + (heightn - margin.bottom) + ")")
    .call(xAxis);

  xAxis.tickValues(xTickValues);

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5);

  axes.append('g')
    .attr("class", "axis y-axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis);

  
  setPointsUp(myData);
  
  // **
  // * Initialize Circles (at the top of each line) / Binding Data  
  // * Initialize Point Lines / Binding Data
  // * Creating a new selection of all objects bound to data 
  // **
  var dataLines, dataCircles, allPoints;

  initializePoints();

  // **
  // * Function to initialize the points & setup mouse events
  // * 
  // * Params: 
  // *** data - The dataset we want to graph
  // **
  function setPointsUp(data) {
    setPoints(data);

    allPoints = d3.selectAll(sketchID + ' .datum');

    // **
    // * Mouse Events
    // **
    allPoints.on('mouseover', function (d, i) {
      var currentData = d;
      var t = allPoints.filter(function (d) {
        return currentData === d;
      });
      d3.selectAll(sketchID + ' .active').classed('active', false);
      t.classed('active', true);
    })
    .on('mouseout', function (d, i) {
      var currentData = d;
      var t = allPoints.filter(function (d) {
        return currentData === d;
      });
      t.classed('active', false);
    })
    .on('click', function (d, i) {
      // Add stuff here if you'd like;
      console.log(d);
    });
  }

  // **
  // * Function to retrieve the x-vale of a point
  // * 
  // * Params: 
  // *** d - The data bound to this points
  // *** i - The index of this point
  // **
  function xValue(d, i) {
    return xScale(d.key);
  }

  // **
  // * Function to retrieve the y-vale of a point
  // * 
  // * Params: 
  // *** d - The data bound to this points
  // *** i - The index of this point
  // **
  function yValue(d, i, offset) {
    if (offset === undefined || offset === null) {
      offset = 0;
    }
    return yScale(d.avg) + offset;
  }

  // **
  // * Function to retrieve the opacity of a point
  // * 
  // * Params: 
  // *** d - The data bound to this points
  // *** i - The index of this point
  // **
  function pointOpacity(d, i) {
    if (d.avg >= maxDocs / 3) {
      return largeOpacityScale(d.avg);
    } else {
      return smallOpacityScale(d.avg);
    }
  }
  
  // **
  // * Function for determining transition duration & delay
  // * The largest values return the largest number
  // *
  // * Params: 
  // *** d - The data bound to this points
  // *** i - The index of this point
  // **
  function transitionTiming(d, i) {
    var t = 800 * d.avg / maxDocs;
    return (t > 300 ? t : 1200 * d.avg / maxDocs);
  }

  // **
  // * Function to set all visible elements to their final position (updating existing points)
  // **
  function initializePoints() {
    var allLines = d3.selectAll(sketchID + ' line');

    var allCirc = d3.selectAll(sketchID + ' circle');

    allLines.transition()
      .duration(transitionTiming)
      .delay(transitionTiming)
      .ease('elastic')
      .attr('y2', function (d, i) {
        return yValue(d, i, circRadius);
      });

    allCirc.transition()
      .duration(600)
      .delay(transitionTiming)
      .ease('elastic')
      .attr('r', circRadius)
      .attr('cy', yValue);
  }

  // **
  // * Function for initializing new points, and transitioning/removing points associated with data that has been removed
  // * The largest values return the largest number
  // *
  // * Params: 
  // *** data - The data we want to draw
  // **
  function setPoints(data) {
    points = pointLayer.selectAll(sketchID + ' .point')
      .data(data, function (d) {
        return d.key;
      });

    var pExit = points.exit();
    var lineExit = pExit.selectAll(sketchID + ' line.datum.point-line');
    var circExit = pExit.selectAll(sketchID + ' circle.datum.point-circle');

    // **
    // * Exiting Points
    // **
    lineExit.transition()
      .delay(345)
      .duration(300)
      .ease('linear')
      .attr('stroke-opacity', 0)
      .attr('x1', function (d, i) {
        return widthn + margin.right + margin.left + 20;
      })
      .attr('x2', function (d, i) {
        return widthn + margin.right + margin.left + 20;
      })
      .attr('stroke-opacity', 0);

    circExit.transition()
      .duration(300)
      .delay(0)
      .ease('linear')
      .attr('cx', function (d, i) {
        return widthn + margin.right + margin.left + 20;
      }).attr('fill-opacity', 0);

    setTimeout(function () {
      pExit.remove();
    }, 800);

    
    // **
    // * Entering Points
    // **
    var pEnter = points.enter()
      .append('g')
      .attr('class', 'point')
      .each(function (d) {
        if (d.avg > maxDocs) {
          maxDocs = d.avg;
        }
        if (d.avg < minDocs) {
          minDocs = d.avg;
        }
      });

    pEnter.append('circle')
      .attr('class', 'datum point-circle');


    pEnter.append('line')
      .attr('class', 'datum point-line');

    pEnter.append('g')
      .attr('class', 'datum label-post-count');

    var lines = d3.selectAll(sketchID + ' .datum.point-line');
    var circs = d3.selectAll(sketchID + ' .datum.point-circle');
    var pcLabel = d3.selectAll(sketchID + ' .datum.label-post-count');
    
    // **
    // * Transition chart title
    // **
    titleArea.transition()
      .duration(800)
      .attr('opacity', 0);

    setTimeout(function () {
      titleArea.attr('opacity', 1)
        .html('');

      // Date Title
      titleArea.append('text')
        .attr('text-anchor', 'middle')
        .classed('day-date', true)
        .text(chartTitle)
        .attr('x', function () {
          var r = (widthn - margin.left - margin.right) / 2;
          return margin.left + r;
        })
        .attr('y', heightn - 7)
        .attr('opacity', 0);

      d3.selectAll(sketchID + ' .day-date').transition()
        .duration(800)
        .attr('opacity', 1);
    }, 850);

    // **
    // * Update scales and axes
    // **
    yScale.domain([maxDocs, 0]);
    largeOpacityScale.domain([maxDocs / 3, maxDocs]);
    smallOpacityScale.domain([minDocs, maxDocs / 3]);

    d3.selectAll(sketchID + ' .y-axis')
      .transition()
      .duration(600).ease("sin-in-out")
      .call(yAxis);

    d3.selectAll(sketchID + ' .x-axis')
      .transition()
      .duration(600).ease("sin-in-out")
      .call(xAxis);


    // **
    // * Set visible elements to starting position
    // **
    lines.attr('x1', xValue)
      .attr('x2', xValue)
      .attr('y1', function (d, i) {
        return heightn - margin.bottom;
      })
      .attr('y2', function (d, i) {
        return heightn - margin.bottom;
      })
      .style('stroke-opacity', pointOpacity)

    circs.attr('r', 0)
      .attr('cx', xValue)
      .attr('cy', heightn)
      .style('fill-opacity', pointOpacity);


    // **
    // * Tooltip
    // **
    pcLabel.append('rect')
      .attr('class', 'label-background')
      .attr('x', function (d, i) {
        return xValue(d, 0) - 50;
      })
      .attr('y', function (d, i) {
        return yValue(d, i, ((circRadius * 2) - 90));
      })
      .attr('width', 100)
      .attr('height', 65)
      .attr('rx', 2)
      .attr('ry', 2);

    pcLabel.append('text')
      .attr('class', 'post-count-numb')
      .attr('x', xValue)
      .attr('y', function (d, i) {
        return yValue(d, i, ((circRadius * 2) - 63));
      })
      .attr('text-anchor', 'middle')
      .text(function (d, i) {
        return d.avg.toFixed(2);
      });

    pcLabel.append('text')
      .attr('class', 'post-count-lab')
      .attr('text-anchor', 'middle')
      .attr('x', xValue)
      .attr('y', function (d, i) {
        return yValue(d, i, ((circRadius * 2) - 49));
      })
      .text(tooltipText);

    pcLabel.append('text')
      .attr('class', 'post-count-date')
      .attr('text-anchor', 'middle')
      .attr('x', xValue)
      .attr('y', function (d, i) {
        return yValue(d, i, ((circRadius * 2) - 34));
      })
      .text(function (d, i) {
        return d.key;
      });


    setTimeout(function () {
      var t = d3.selectAll(sketchID + ' .datum').filter(function (d) {
        return Math.round(maxDocs * 10) / 10 === Math.round(d.avg * 10) / 10;
      });
      t.classed('active', true);
    }, 1600);

    initializePoints(); // update function
  }
}