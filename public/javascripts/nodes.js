//Variables
var dummy = 0;
var width = window.innerWidth;
var word = "node";
height = 600;
height = 350;
var projectID = null;

//config for 
var colorScale = ['orange', 'lightblue', '#B19CD9'];
var xScale = d3.scaleLinear().domain([0, 1]).range([0, 1000]);

//creating variable for the svg and attaching it to main svg


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
var nodes = d3.range(numNodes).map(function (d, i) {
    return {
        radius: 30,
        value: 0.2 * i,
        index: i,
        clicked: 0
    }
});


//animatino for nodes entering
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
            d3.select(this).style("fill","blue").attr('r', d.radius*1.5);
            nodeMarked = i;
            csvFile();
            showPie();
            d.clicked++;
            eventNumberToHtml1()
        }
        else
        {
            d3.select(this).style("fill","#000").attr('r', d.radius);
            removePie();
            d.clicked--;
        }
    });

    u.exit().remove();
}
nodeMarked = -1;

//update and traverse data for graphs
function csvFile() {
    if(projectID == null){
        console.log("nu e vi h'r XDDDDDDD");
        projectID = prompt("Ange simulationsid, tryck avbryt för senaste simulering", "");
        if(projectID == null){
            var xmlhttp = new XMLHttpRequest();
            var mostRecentUrl = "http://localhost:8081/mostRecent";
            console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBb");
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    var myObj = JSON.parse(this.responseText);
                    projectID = myObj.simulationID;
                    console.log(this.responseText);
                    console.log(projectID+"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASFSDGSEGWEGWEGFW")
                }
            };
            xmlhttp.open("GET", mostRecentUrl, false);
            xmlhttp.send();            
        }
    }

    d3.csv("http://localhost:8081/files/"+projectID+"/"+nodeMarked+".csv").then(function (data) {
        //data for piechart
        updatePie({a: data[currentEvent].MAP, b: 1-data[currentEvent].MAP});
        //data for barchart
        updateBar([
            {group: `Event ${currentEvent}`, value: data[currentEvent].MAP},
            {group: `Event ${currentEvent+1}`, value: data[currentEvent+1].MAP},
            {group: `Event ${currentEvent+2}`, value: data[currentEvent+2].MAP}]);
        updateNodeLineChart(d3.range(data.length).map(function(d) { return {"y": data[d].MAP } }));
        
        
    })
}
let currentEvent=0;

//Bottom buttons for graph management
function resetNodes() {
    d3.selectAll('circle').style("fill","#000");
    for (let step = 0; step < 5; step++) {
        // Runs 5 times, with values of step 0 through 4.

        
        d3.selectAll('circle').style("fill","#000").attr('r', nodes[step].radius);
        if (nodes[step].clicked == 1){
            nodes[step].clicked = 0;
        }
        
      }
    removePie();
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
    eventNumberToHtml()
}
//Event input field
// when the input range changes update value
d3.select("#nValue").on("input", function() {
    updateInput(+this.value);
});

// Initial update value
updateInput(0);

// adjust the text
function updateInput(nValue) {
    currentEvent = nValue;
    d3.csv("node.csv").then(function (data) {
        updatePie({a: data[currentEvent].MAP, b: 1-data[currentEvent].MAP})
    })
    eventNumberToHtml()
}

//debugging tool
function print(data) {
    console.log(data);
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
function eventNumberToHtml1() {
    document.getElementById("output1").innerHTML = nodeMarked;
}