var dummy = 0;
var width = window.innerWidth,
height = 600;
height = 350;

var colorScale = ['orange', 'lightblue', '#B19CD9'];
var xScale = d3.scaleLinear().domain([0, 1]).range([0, 1000]);

var svg = d3.select('#target').append('svg')
    .attr('width', width)
    .attr('height', height);


var links = [
    {source: 0, target: 1},
    {source: 1, target: 2},
    {source: 2, target: 3},
    {source: 3, target: 4},
    //{source: 4, target: 5}
];

var numNodes = 5;
var nodes = d3.range(numNodes).map(function (d, i) {
    return {
        radius: 30,
        value: 0.2 * i,
        index: i,
        clicked: 0
    }
});

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

/*
//Initialize the pie when entering the page
function initPie() {
    console.log("vafan")
    d3.csv("nodes/node1.csv").then(function (data) {
        updatePie({a: data[currentEvent].MAP, b: 1-data[currentEvent].MAP})

    })
    console.log("benis")
    eventNumberToHtml()
}

 */


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
function updateNodes() {
    var u = d3.select('svg')
        .selectAll('circle')
        .data(nodes);

    u.enter()
        .append('circle')
        .attr('r', function (d) {
            return d.radius;
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
        // if(dummy == 0){
        //     initPie();
        //     dummy++;
        // }
        // else
        if(d.clicked == 0)
        {
            d3.select(this).style("fill","lightcoral");
            d3.select(this).attr('r', d.radius*2);
            nodeMarked = i;
            csvFile();
            showPie();
            d.clicked++;
        }
        else
        {
            d3.select(this).style("fill","#000");
            d3.select(this).attr('r', d.radius);
            removePie();
            d.clicked--;
        }
    });

    u.exit().remove();
}

nodeMarked = -1;

function csvFile() {
    d3.csv("nodes/node"+nodeMarked+".csv").then(function (data) {
        updatePie({a: data[currentEvent].MAP, b: 1-data[currentEvent].MAP});
        updateBar([
            {group: `Event ${currentEvent}`, value: data[currentEvent].MAP},
            {group: `Event ${currentEvent+1}`, value: data[currentEvent+1].MAP},
            {group: `Event ${currentEvent+2}`, value: data[currentEvent+2].MAP}]);
        print(data);
        console.log("fan");
    })
}
let currentEvent=0;

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

function print(data) {
    console.log(data);
}

function ticked() {
    updateLinks();
    updateNodes();
}

function eventNumberToHtml() {
    document.getElementById("output").innerHTML = currentEvent;
}
