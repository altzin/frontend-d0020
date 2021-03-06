//Variables
var width = window.innerWidth;
height = 600;
height = 350;
var projectID = null;
var drawAxel = true;
var drawAvgChart = true;
var xScale = d3.scaleLinear().domain([0, 1]).range([0, 1000]);

//setup links between nodes
var links = [
    {source: 0, target: 1},
    {source: 1, target: 2},
    {source: 2, target: 3},
    {source: 3, target: 4},
    //{source: 4, target: 5}
];

//setup for nodes
var numNodes = 5;
nodeColors = d3.schemeCategory10; //Color scheme

//Generates the nodes objects
var nodes = d3.range(numNodes).map(function (d, i) {
    return {
        radius: 30,
        value: 0.2 * i,
        index: i,
        clicked: 0,
        color: nodeColors[i]
    }
});


//animation for nodes entering
var simulation = d3.forceSimulation(nodes)

    .force('collision', d3.forceCollide().radius(function (d) {
        return d.radius;
    }))
    .force("center", d3.forceCenter().x(width / 2).y(height / 2))
    .force('link', d3.forceLink().links(links))
    .force('x', d3.forceX(function(d) {
        return xScale(d.value);
    }).strength(2))
    .force('y', d3.forceY(0).strength(0))
    .on('tick', ticked);

//draws links
function updateLinks() {
    var u = d3.select('svg')
        .selectAll('line')
        .data(links);
    u.enter()
        .append('line')
        .merge(u)
        .attr('x1', function(d) {
            return d.source.x
        })
        .attr('y1', function(d) {
            return d.source.y
        })
        .attr('x2', function(d) {
            return d.target.x
        })
        .attr('y2', function(d) {
            return d.target.y
        });
    u.exit().remove()
}

//draws cirles/nodes
function updateNodes() {
    var u = d3.select('svg')
        .selectAll('circle')
        .data(nodes);

    u.enter()
        .append('circle')
        .attr('r', function (d) {
            return d.radius;
        })
        .attr('id', function(d){
            return  d.index;
        })

        .style('fill', function (d) {
            return d.color;
        })
        .merge(u)
        .attr('cx', function (d) {
            return d.x;
        })
        .attr('cy', function (d) {
            return d.y;
        })
    u.on("click", function(d,i) {
        if(d.clicked == 0)
        {
            d3.select(this).attr('r', d.radius*1.5);
            nodeMarked = i;
            csvFile();
            showGraphs();
            d.clicked++;
            nodeMarkedToHtml()
        }
        else if(d.clicked == 1) {
            resetNodes()
        }
        else
        {
            d3.select(this).attr('r', d.radius);
            removeGraphs();
            d.clicked--;
            drawAxel = true;
        }
    });

    u.exit().remove();
}
nodeMarked = -1; //Node -1 doesnt exist, good for init

//update and traverse data for graphs
function csvFile() {
    
    if(projectID == null){
        projectID = prompt("Ange simulationsid, tryck avbryt för senaste simulering", "");
        if(projectID == null){
            var xmlhttp = new XMLHttpRequest();
            var mostRecentUrl = "http://localhost:8081/mostRecent";
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    var myObj = JSON.parse(this.responseText);
                    projectID = myObj.simulationID;
                    console.log(this.responseText);
                }
            };
            xmlhttp.open("GET", mostRecentUrl, false);
            xmlhttp.send();
        }
    }
    if(drawAvgChart){
        drawAvgChart = false;
        
        d3.csv("http://localhost:8081/files/"+projectID+"/average.csv").then(function (data) {
            updateLineChart(d3.range(data.length).map(function(d) { return {"y": data[d].AVG_MAP , "x": data[d].TIME} }));
        })


    }
    d3.csv("http://localhost:8081/files/"+projectID+"/"+nodeMarked+".csv").then(function (data) {
        //data for piechart
        updatePie({a: data[currentEvent].MAP, b: 1-data[currentEvent].MAP});
        //data for barchart
        updateBar([
            {group: `Event ${currentEvent}`, value: data[currentEvent].MAP},
            {group: `Event ${currentEvent+1}`, value: data[currentEvent+1].MAP},
            {group: `Event ${currentEvent+2}`, value: data[currentEvent+2].MAP}]);
        updateNodeLineChart(d3.range(data.length).map(function(d) { return {"y": data[d].MAP, "x": data[d].TIME } }), drawAxel);
        drawAxel = false;
        projectNumberToHtml();

    })
}
let currentEvent=0;

//Bottom buttons for graph management
function resetNodes() {
    for (let step = 0; step < 5; step++) {
        // Runs 5 times, with values of step 0 through 4.
        d3.selectAll('circle').attr('r', nodes[step].radius);
        if (nodes[step].clicked == 1){
            nodes[step].clicked = 0;
        }

      }
    drawAxel = true;
    removeGraphs();
}
function nextEvent() {
    currentEvent++;
    csvFile();
    eventNumberToHtml()
}
function previousEvent() {
    if (currentEvent > 1) {
        currentEvent--;
    } else {
        currentEvent = 0;
    }
    csvFile();
    eventNumberToHtml()
}
function resetEvent(){
    currentEvent = 0;
    d3.csv("node.csv").then(function (data) {
        updatePie({a: data[currentEvent].MAP, b: 1-data[currentEvent].MAP})
    })
    csvFile();
    eventNumberToHtml();
}


function ticked() {
    updateLinks();
    updateNodes();
}

//for printing event number to html
function eventNumberToHtml() {
    document.getElementById("output").innerHTML = currentEvent;
}

//for printing event number to html
function nodeMarkedToHtml() {
    document.getElementById("output1").innerHTML = nodeMarked;
}
function projectNumberToHtml() {
    document.getElementById("output2").innerHTML = projectID;
}

//SLIDER IS UNDER CONSTRUCTION (Events doesn't update properly) !!!
var slider = document.getElementById("myRange");
var outputslider = document.getElementById("output");
outputslider.innerHTML = slider.value;
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    currentEvent = slider.value;
    csvFile();
    eventNumberToHtml();
}

