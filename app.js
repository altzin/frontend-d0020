const express = require('express');
const formidable = require('formidable')
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {


    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<iframe name="dummyframe" id="dummyframe" style="display: none;"></iframe>')
    res.write('<form action="http://localhost:8081/" method="post" enctype="multipart/form-data" target="dummyframe">');
    res.write('<input type="file" name="file"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();


});

app.get('/simulator', (req, res) => {
    res.sendFile(__dirname + '/public/simulator.html');
});

app.listen(8000, () => console.log('node server started on port 8000'));