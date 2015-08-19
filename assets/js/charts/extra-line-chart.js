// ****************
// *	This file makes a basic lollipop bar chart
// ****************	


// **
// * Function to initialize a volume line chart, using weekly averages as points 
// * note: this is just a static line chart without updating
// * Params: 
// *** sketchID - The ID of the element to contain this chart
// *** theData - The dataset we want to graph
// **
function makeExtraLine(sketchID, theData) {
	var data = [];
	var temp = {};
	var max = {
		numberOfDocuments: 0
	};
	var min = {
		numberOfDocuments: theData[0].numberOfDocuments
	};

	// **
	// * Parse all of the data to make a new dataset consisting of weekly averages
	// **
	for (var i = 0; i < theData.length; i++) {
		if (i % 7 === 0) {
			temp = {};
			temp.startDate = new Date(theData[i].startDate);
			temp.startDate.setTime(temp.startDate.getTime() + (1000 * 60 * Math.abs(temp.startDate.getTimezoneOffset())));
			temp.total = parseInt(theData[i].numberOfDocuments);
			temp.count = 1;
		} else {
			temp.total = temp.total + parseInt(theData[i].numberOfDocuments);
			temp.count = temp.count + 1;
			temp.endDate = new Date(theData[i].endDate);
			temp.endDate.setTime(temp.endDate.getTime() + (1000 * 60 * Math.abs(temp.endDate.getTimezoneOffset())));
		}
		if ((i + 1) % 7 === 0) {
			temp.numberOfDocuments = temp.total / temp.count;
			if (temp.numberOfDocuments >= max.numberOfDocuments) {
				max = temp;
			}
			if (temp.numberOfDocuments <= min.numberOfDocuments) {
				min = temp;
			}
			data.push(temp);
			temp = {};
		}
	}
	if (temp.total) {
		temp.numberOfDocuments = temp.total / temp.count;
		data.push(temp);
	}

	var widthn = $(sketchID).innerWidth() - 20;
	var width = widthn + 'px';
	var heightn = 150;
	var height = heightn + 'px';
	var margin = {
		top: 10,
		bottom: 25,
		left: 10,
		right: 10
	};

	var xScale = d3.time.scale().range([margin.left, widthn - margin.right]);
	var yScale = d3.scale.linear().range([margin.top, heightn - margin.bottom]);


	// **
	// * Axes
	// **
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.tickValues([data[0].startDate, data[parseInt((data.length - 1) / 2)].startDate, data[data.length - 1].startDate])
		.tickFormat(d3.time.format("%b '%y"));

	xScale.domain(d3.extent(data, function (d) {
		return d.startDate;
	}));

	yScale.domain([d3.max(data, function (d) {
		return parseInt(d.numberOfDocuments);
	}), 0]);


	var svg = d3.select(sketchID + " .viz-content")
		.append("svg")
		.attr('width', width)
		.attr('height', height);

	// **
	// * Creating the Line function
	// **
	var valueline = d3.svg.line()
		.x(function (d) {
			return xScale(d.startDate);
		})
		.y(function (d) {
			return parseInt(yScale(parseInt(d.numberOfDocuments)));
		});

	// **
	// * Creating g elements for min and max point lines
	// **
	var maxLine = svg.append('g').attr('class', 'max-min-point');
	var minLine = svg.append('g').attr('class', 'max-min-point');

	// **
	// * Creating the line
	// **
	var path = svg.append("path")
		.attr("class", "line")
		.attr("d", valueline(data));
	
	console.log(path);

	var totalLength = path.node().getTotalLength();

	// **
	// * Transition line drawing
	// **
	path.attr("stroke-dasharray", totalLength + " " + totalLength)
		.attr("stroke-dashoffset", totalLength)
		.transition()
		.duration(2000)
		.delay(750)
		.ease("sin-out")
		.attr("stroke-dashoffset", 0);

	var xAxisG = svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (heightn - margin.bottom) + ")")
		.call(xAxis);
	
	xAxisG.select('.tick text').style('text-anchor', 'start');
	xAxisG.select('.tick:last-of-type text').style('text-anchor', 'end');

	// **
	// * Max/Min cicles and dotted lines
	// **
	var firstPoint = svg.append('g')
		.attr('class', 'first-date')
		.append('circle')
		.attr('r', 3)
		.attr('cx', xScale(data[0].startDate))
		.attr('cy', yScale(data[0].numberOfDocuments) + 2)
		.attr('opacity', 0)
		.transition()
		.duration(1500)
		.attr('opacity', 1);

	var secondPoint = svg.append('g')
		.attr('class', 'first-date')
		.append('circle')
		.attr('r', 0)
		.attr('cx', xScale(data[data.length - 1].startDate))
		.attr('cy', yScale(data[data.length - 1].numberOfDocuments) + 2)
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

	maxLine.append('line')
		.attr('x1', xScale(max.startDate))
		.attr('x2', xScale(max.startDate))
		.attr('y1', heightn - margin.bottom)
		.attr('y2', heightn - margin.bottom)
		.transition()
		.delay(900)
		.duration(1000)
		.attr('y2', yScale(max.numberOfDocuments) + 2);

	maxLine.append('text')
		.text(max.numberOfDocuments.toFixed(0) + ' posts')
		.attr('text-anchor', 'end')
		.attr('x', xScale(max.startDate) - 5)
		.attr('y', yScale(max.numberOfDocuments) + 10)
		.style('opacity', 0)
		.transition()
		.delay(1700)
		.duration(300)
		.style('opacity', 1);

	minLine.append('line')
		.attr('x1', xScale(min.startDate))
		.attr('x2', xScale(min.startDate))
		.attr('y1', heightn - margin.bottom)
		.attr('y2', heightn - margin.bottom)
		.transition()
		.delay(1900)
		.duration(1000)
		.attr('y2', yScale(min.numberOfDocuments));

	minLine.append('text')
		.text(min.numberOfDocuments.toFixed(0) + ' posts')
		.attr('text-anchor', 'end')
		.attr('x', xScale(min.startDate) - 4)
		.attr('y', yScale(min.numberOfDocuments) + 10)
		.style('opacity', 0)
		.transition()
		.delay(2400)
		.duration(300)
		.style('opacity', 1);
}