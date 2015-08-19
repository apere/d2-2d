// ****************
// *	This file makes a basic line chart
// ****************

// **
// * Function to initialize a basic line chart with a point on each end
// *
// * note: this is a static line chart with no updating
// * 
// * Params: 
// *** sketchID - The ID of the element to contain this chart
// *** theData - The dataset we want to graph
// **
function makeBasicLine(sketchID, theData) {
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
		top: 10,
		bottom: 25,
		left: 15,
		right: 15
	};

	var xScale = d3.time.scale().range([margin.left, widthn - margin.right]);
	var yScale = d3.scale.linear().range([margin.top, heightn - margin.bottom]);


	// **
	// * Creating Axes
	// **
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.tickValues([new Date('06/01/2014'), new Date('9/01/2014'), new Date('12/01/2014')])
		.tickFormat(d3.time.format("%b '%y"));

	xScale.domain(d3.extent(data, function (d) {
		return d.date;
	}));

	yScale.domain([d3.max(data, function (d) {
		return d.value;
	}), 0]);


	var svg = d3.select(sketchID + " .viz-content")
		.append("svg")
		.attr('width', width)
		.attr('height', height);

	// **
	// * Line Function
	// **
	var valueline = d3.svg.line()
		.x(function (d) {
			return xScale(d.date);
		})
		.y(function (d) {
			return parseInt(yScale(d.value));
		});

	// **
	// * Creating the line
	// **
	var path = svg.append("path")
		.attr("class", "line")
		.attr("d", valueline(data));

	var xAxis = svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (heightn - margin.bottom) + ")")
		.call(xAxis);

	xAxis.select('.tick text').style('text-anchor', 'start');
	xAxis.select('.tick:last-of-type text').style('text-anchor', 'end');

	// **
	// * Creating first and last points 
	// **
	var firstPoint = svg.append('g')
		.attr('class', 'first-date')
		.append('circle')
		.attr('r', 3)
		.attr('cx', xScale(data[0].date))
		.attr('cy', yScale(data[0].value))
		.attr('opacity', 0)
		.transition()
		.duration(1500)
		.attr('opacity', 1);

	var secondPoint = svg.append('g')
		.attr('class', 'first-date')
		.append('circle')
		.attr('r', 0)
		.attr('cx', xScale(data[data.length - 1].date))
		.attr('cy', yScale(data[data.length - 1].value))
		.attr('opacity', 0)
		.transition()
		.duration(1200)
		.delay(2500)
		.ease('elastic')
		.attr('opacity', 1)
		.attr('r', 6)
		.transition()
		.duration(2000)
		.ease('bounce')
		.attr('r', 3);

	var totalLength = path.node().getTotalLength();

	// **
	// * Animating the drawing of the line
	// **
	path.attr("stroke-dasharray", totalLength + " " + totalLength)
		.attr("stroke-dashoffset", totalLength)
		.transition()
		.duration(2000)
		.delay(750)
		.ease("sin-out")
		.attr("stroke-dashoffset", 0);
}