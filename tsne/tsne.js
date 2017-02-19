// JS to use D3 to perform t-SNE visualization

var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = 1060 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0])

// setup fill color
var cValue = function(d) {
    return d.label;
};
color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function dragged() {
    d3.select(this).attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
}

var chartGroup = svg.append("g").call(d3.drag().on("drag", dragged));

// define zoom
chartGroup.call(d3.zoom().on("zoom", function() {
    chartGroup.attr("transform", d3.event.transform);
}));


// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.tsv("tsne_d3.tsv", function(error, data) {
    if (error) throw error;

    // console.log(data);

    data.forEach(function(d) {
        d.x = +d.x;
        d.y = +d.y;

        // console.log(d);
    });

    // console.log(data)

    x.domain(d3.extent(data, function(d) {
        return d.x;
    })).nice();
    y.domain(d3.extent(data, function(d) {
        return d.y;
    })).nice();

    // x-axis
    chartGroup.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("X coord");

    // y-axis
    chartGroup.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Y coord")

    // draw dots
    chartGroup.selectAll(".point")
        .data(data)
        .enter().append("image")
        .attr("class", "point")
        .attr("x", function(d) {
            return x(d.x);
        })
        .attr("y", function(d) {
            return y(d.y);
        })
        .attr("width", 12)
        .attr("height", 12)
        .attr("xlink:href", function(d) { return "images/" + d.idx + ".jpg"; })
        .style("fill", function(d) {
            return color(cValue(d));
        })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(100)
                .style("opacity", 1.0);
            tooltip.html(d.label + " - images/" + d.idx + "<br/> (" + d.x +
                    ", " + d.y + ")")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(300)
                .style("opacity", 0);
        });

    // draw legend
    var legend = chartGroup.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return d;
        })
});