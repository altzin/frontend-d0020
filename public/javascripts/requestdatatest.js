var url = "http://localhost:8081/files/a657/a0.csv";

d3.csv(url).then(function(data) {
    console.log(data[0]);
  });