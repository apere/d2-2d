// **
// * A basic vertical bar chart that compares to values for each point and displays a 3rd score for that point using the opacity of the block to the left.
// * If I were to do this one over again, I would have made the labels part of the svg... it's too difficult to get them to always line up otherwise
// **
function makeVerticalBarChart(sketchID, data) {
  var widthn = $(sketchID + ' .viz-content').innerWidth() - 20;
  var width = widthn + 'px';
  var heightn = 1303;
  var height = heightn + 'px';
  var margin = {
    top: 0,
    bottom: 30,
    left: 15,
    right: 15
  };
  
  var maxPercent = 0;
  var maxRel = 0;
  var minRel = data[0].relevancyScore;
  
  var yScale = d3.scale.linear().domain([0, data.length - 1]).range([margin.top, heightn - margin.bottom]);
  var sizeScale = d3.scale.linear().domain([0, 100]).range([margin.left, widthn - margin.right]);
  var relScale = d3.scale.linear().domain([0, 100]).range([0.05, 1]);
  

  
  var sketch6 = d3.select(sketchID + ' .viz-content')
    .append("svg")
    .attr('width', width)
    .attr('height', height);
  
  data.sort(function(a, b) {
      if(a.relevancyScore > b.relevancyScore) {
        return -1; 
      } else if(a.relevancyScore < b.relevancyScore){
         return 1;
      } 
      return 0;
  });
  
  // **
  // * Making the legend
  // **
  var labels = d3.select(sketchID + ' .viz-labels').selectAll('li')
        .data(data)
        .enter()
        .append('li')
        .text(function(d,i) {
            return d.name;
        });
  
  // **
  // * Create a new g element for each point
  // **
  var points = sketch6.append('g')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'datum')
    .each(function(d, i) {
    if( d.percentInMonitor > maxPercent) {
      maxPercent = d.percentInMonitor; 
    }
    if( d.percentOnTwitter > maxPercent) {
      maxPercent = d.percentOnTwitter; 
    }
    if( d.relevancyScore > maxRel) {
      maxRel = d.relevancyScore; 
    }
    if(d.relevancyScore < minRel) {
      minRel = d.relevancyScore; 
    }
    });
  
  // **
  // * Update the scales now that we have min and max info
  // **
  sizeScale.domain([0, maxPercent]); 
  relScale.domain([minRel, maxRel]);
  
  // **
  // * Creating the background bars
  // **
  var fullpercent = points.append('rect').attr('class', 'point-container')
    .attr('x', 15)
    .attr('y', function(d,i) {
        return yScale(i);
    })
    .attr('height', 10)
    .attr('width', function(d,i) {
        return sizeScale(maxPercent); 
    });
  
  // **
  // * Creating the bars for my monitor
  // **
  var myMonitor = points.append('rect')
      .attr('class', 'monitor-point')
      .attr('x', 15)
      .attr('y', function(d,i) {
          return yScale(i);
      })
      .attr('height', 5)
      .attr('width', 5)
      .transition()
      .duration(450)
      .delay(50)
      .ease('cubic-in-out')
      .attr('width', function(d,i) {
          return sizeScale(d.percentInMonitor); 
      });
  
  // **
  // * Creating the bars for my all of twitter
  // **
  var allTwitter = points.append('rect').attr('class', 'twitter-point')
    .attr('x', 15)
    .attr('y', function(d,i) {
        return yScale(i) + 5;
    })
    .attr('height', 5)
    .attr('width', 5)
    .transition()
    .duration(250)
    .delay(50)
    .attr('width', function(d,i) {
        return sizeScale(d.percentOnTwitter); 
    });
  
  // **
  // * Creating the bars for relevancy score
  // **
  var relLines = points.append('rect')
    .attr('class', 'rel-rect')
    .attr('x', 15)
    .attr('y', function(d,i) {
      return yScale(i);
    })
    .attr('height', 10)
    .attr('width', 0)
    .attr('opacity', 0)
    .transition()
    .duration(450)
    .delay(function(d,i) {
      return i * 10; 
    })
    .ease('sin-in')
    .attr('opacity', function(d,i) {
        return relScale(d.relevancyScore);
    })
    .attr('width', 10)
    .attr('x', 0)
    .transition()
    .duration(50)
    .attr('x', 5);
}