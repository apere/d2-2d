var TheChart;

// This is an example Reusable chart... this is a bar chart
// A Reusable chart allows you to easily create a new chart and set various parameters at the same time.
// Note: This was my first reusable chart... and there is much that could be cleaned up and modularized

var chart = d3.chart('BarPercent', {
  initialize: function (params) {
    theChart = this;
    if (params.width != undefined)
      this.w = params.width;
    else
      this.w = 250; // sets default values for variables
    if (params.height != undefined)
      this.h = params.height;
    else
      this.h = 250;
    if (params.margin != undefined)
      this.margin = params.margin;
    else
      this.margin = {
        'top': 10,
        'right': 10,
        'left': 10,
        'bottom': 20
      };
    if (params.id != undefined)
      this.id = params.id;
    else
      this.id = 'barChart-' + parseInt(Math.random() * 100);
    if (params.color != undefined)
      this.color = params.color;
    else
      this.color = '#000000';
    if (params.numCategories != undefined)
      this.numCategories = params.numCategories;
    else
      this.numCategories = 4;
    if (params.categorySwap != undefined)
      this.categorySwap = params.categorySwap;
    else
      this.categorySwap = {};

    this.minNum = 100000000;
    this.maxNum = -10000000;


    this.xScale = d3.scale.linear().domain([Math.min(0, this.minNum - 1), this.maxNum]).range([0, this.w - this.margin['left'] - this.margin['right']]); //Update Me

    this.parentID = '#' + $(this.base[0]).parent().parent().prop('id');

    $(this.base[0]).attr('height', this.h + 'px');
    $(this.base[0]).attr('width', this.w + 'px');
    $(this.base[0]).on("mouseleave", function () {
        return tooltip.style("visibility", "hidden");
      })
      .on("mousemove", function () {
        return tooltip.style("top", (event.pageY + 10) + "px").style("left", (event.pageX + 10) + "px");
      });

    var tooltip = d3.select('body').append('div')
      .classed('tooltip', 'true')
      .style('position', 'absolute')
      .style('z-index', '1000')
      .style('visibility', 'hidden')
      .text('a simple tooltip');

    tooltip.on("mousemove", function () {
      return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
    });

    var dataBase = this.base.append('g')
      .classed('all-points', true);


    this.layer('all-points', dataBase, { // things to do on initial data binding
      dataBind: function (data) {
        var chart = this.chart();
        for (var i in data) {
          if (data[i]['number'] > chart.maxNum)
            chart.maxNum = data[i]['number'];
          if (data[i]['number'] < chart.minNum)
            chart.minNum = data[i]['number'];
        }
        chart.updateScales();
        d3.selectAll(chart.parentID + ' .all-points>.point').remove();


        return this.selectAll('.point').data(data);; // return a data bound selection for the passed in data.
      },
      // setup the elements that were just created
      insert: function () {
        var chart = this.chart();
        return this.append('g').attr('class', 'point');
      },

      // setup an enter event for the data as it comes in:
      events: {
        'enter': function () {
          var chart = this.chart();
          // position newly entering elements

          this.append('rect').attr('data-category', function (d, i) {
              return d.name
            })
            .attr('x', chart.margin.left)
            .attr('y', function (d, i) {
              return i * (chart.h - chart.margin.top - chart.margin.bottom) / chart.numCategories;
            })
            .attr('width', 0)
            .attr('height', (chart.h - chart.margin.top - chart.margin.bottom) / chart.numCategories).attr('fill-opacity', chart.getOpacity)
            .attr('fill', chart.getColor)
            .on("click", function (d, i) { // custom event with name 'chartElementClicked' thrown on the chart object
              console.log('#' + chart.id + ' td.legend-label[data-category = "' + d.name + '"]');
              $('#' + chart.id + ' td.legend-label[data-category = "' + d.name + '"]').toggleClass('click-activated');
              $(chart).trigger('chartElementClicked', [{
                "riskLevel": d.name,
                "riskLevelAlias": chart.categorySwap[d.name],
                "componentCount": d.number,
                "chartID": chart.id,
                "barColor": chart.getColor(d, i),
                "barOpacity": chart.getOpacity(d, i),
                "isActive": $('#' + chart.id + ' td.legend-label[data-category = ' + d.name + ']').hasClass('click-activated')
                        }]);
            }).on('mouseover', function(d,i) {
              tooltip.style('visibility', 'visible');
              tooltip.html(function() {
               return d.name + ': ' + d.number; 
              });
            }).on('mouseout', function() {
              tooltip.style('visibility', 'hidden');
            });

          this.append('text')
            .attr('text-anchor', 'end')
            .attr('x', chart.margin.left - 10)
            .attr('y', function (d, i) {
              var cat = chart.numCategories;
              var offset = (chart.h - chart.margin.top - chart.margin.bottom) / cat - 4;
              offset = offset / 1.25;
              return i * (chart.h - chart.margin.top - chart.margin.bottom) / cat + offset;
            })
            .text(function (d, i) {
              return d.number;
            })
            .attr("font-family", "open sans")
            .attr('font-size', '14px');
          
          this.append('text')
            .attr('text-anchor', 'end')
            .attr('x', chart.margin.left - 40)
            .attr('y', function (d, i) {
              var cat = chart.numCategories;
              var offset = (chart.h - chart.margin.top - chart.margin.bottom) / cat - 4;
              offset = offset / 1.25;
              return i * (chart.h - chart.margin.top - chart.margin.bottom) / cat + offset;
            })
            .text(function (d, i) {
              return d.name;
            })
            .attr("font-family", "open sans")
            .attr('font-size', '14px');
          
          // transition to new position
          return this.selectAll('rect').transition()
            .duration(575)
            .attr('width', function (d, i) {
              return chart.getWidth(d, i);
            });
        },
        'exit': function () {
          var chart = this.chart();
          this.selectAll('rect').transition().duration(300).attr('width', 0);
          return this.transition().delay(300).remove();
        }
      }
    });
  },
  width: function (newWidth) { // width getter-setter
    if (arguments.length === 0) {
      return this.w;
    }
    this.w = newWidth;
    this.updateScales();
    $(this.base[0]).attr('width', this.w);
    this.updateScales();
    this.updateThePoints();
    return this;
  },
  height: function (newHeight) { // height getter-setter
    if (arguments.length === 0) {
      return this.h;
    }
    this.h = newHeight;
    this.updateScales();
    this.updateThePoints();
    $(this.base[0]).attr('height', this.h);
    return this;
  },
  updateScales: function () { // resets the scales used for drawing the points
    this.xScale = this.xScale = d3.scale.linear().domain([Math.min(0, this.minNum - 1), this.maxNum]).range([0, this.w - this.margin['left'] - this.margin['right']]); //Update Me
  },
  updateThePoints: function () {
    // *** add code to update the points
  },
  updateAll: function () {
    this.updateScales();
    this.updateThePoints();
  },
  getOpacity: function (d, i) {

    if (i == theChart.numCategories - 1)
      return .125;
    else
      return (theChart.numCategories - i - 1) / parseInt(theChart.numCategories - 1);
  },
  getColor: function (d, i) {
    if (i == this.numCategories - 1)
      return "#000000";
    else
      return this.color;
  },
  getWidth: function (d, i) {
    return this.xScale(parseInt(d.number));
  }
});