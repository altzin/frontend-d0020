
// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#target2")
    .append("svg")
        .attr("width", width * 2 + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
         .attr("transform",
          "translate(" + margin.left * 6 + "," + margin.top / 3 + ")");

// Initialize the X axis
var x = d3.scaleBand()
    .range([ 0, width ])
    .padding(0.2);
var xAxis = svg2.append("g")
    .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
    .range([ height, 0]);
var yAxis = svg2.append("g")
    .attr("class", "myYaxis")


// A function that create / update the plot for a given variable:
function updateBar(data) {

    // Update the X axis
    x.domain(data.map(function(d) { return d.group; }))
    xAxis.call(d3.axisBottom(x))

    // Update the Y axis
    y.domain([0, d3.max(data, function(d) { return 1 }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // Create the u variable
    var u = svg2.selectAll("rect")
        .data(data)

    u
        .enter()
        .append("rect") // Add a new rect for each new elements
        .merge(u) // get the already existing elements as well
        .transition() // and apply changes to all of them
        .duration(1000)
        .attr("x", function(d) { return x(d.group); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", "#69b3a2")

    // If less group in the new dataset, I delete the ones not in use anymore
    u
        .exit()
        .remove()
}

// Initialize the plot with the first dataset
updateBar(data1)