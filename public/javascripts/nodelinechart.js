

function updateNodeLineChart(data, drawAxel) {
    // 1. Add the SVG to the page and employ #2
    // 2. Use the margin convention practice

    var margin = {top: 50, right: 50, bottom: 200, left: 60},
        width = 700 - margin.left - margin.right,
        height = 540 - margin.top - margin.bottom;

// The number of datapoints
    var n = parseFloat(data[data.length-1].x) +parseFloat(data[data.length-1].x)*0.2;
// 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
        .domain([0, n-1]) // input
        .range([0, width]); // output

// 6. Y scale will use the randomly generate number
    var yScale = d3.scaleLinear()
        .domain([0, 1]) // input
        .range([height, 0]); // output

// 7. d3's line generator
    var line = d3.line()
        .x(function(d) { return xScale(d.x); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
        .curve(d3.curveMonotoneX) // apply smoothing to the line
    var svg3 = d3.select("#target3").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left  + "," + margin.top /2.5 + ")");

// 3. Call the x axis in a group tag
    if(drawAxel){
    svg3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
    svg3.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft
    }
// 9. Append the path, bind the data, and call the line generator
    svg3.append("path")
        .datum(data) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("stroke", nodes[nodeMarked].color)
        .attr("d", line); // 11. Calls the line generator
    console.log("nodes shizzle" + nodes[nodeMarked].color)

// 12. Appends a circle for each datapoint
    // svg3.selectAll(".dot")
    //     .data(data)
    //     .enter().append("circle") // Uses the enter().append() method
    //     .attr("class", "dot") // Assign a class for styling
    //     .attr("cx", function(d) { return xScale(d.x) })
    //     .attr("cy", function(d) { return yScale(d.y) })
    //     .attr("r", 2)
    //     .on("mouseover", function(a, b, c) {
    //         //console.log(a)
    //         this.attr('class', 'focus')
    //     })
    //     .on("click", function() {
    //         svg3.selectAll('path').remove();
    //         svg3.selectAll('.dot').remove();
    //     })
}

