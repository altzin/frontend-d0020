const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const axios = require('axios')
var fs = require('fs');
const popup = require('node-popup');

// default options
app.use(fileUpload());
app.use(express.static('public'));

app.get('/', (req, res) => {

    res.sendFile(__dirname + '/public/index.html');
    // res.writeHead(200, { 'Content-Type': 'text/html' });
    // res.write('<iframe name="dummyframe" id="dummyframe" style="display: none;"></iframe>')
    // res.write('<form action="http://localhost:8081/" method="post" enctype="multipart/form-data" target="dummyframe">');
    // res.write('<input type="file" name="file"><br>');
    // res.write('<input type="submit">');
    // res.write('</form>');
    // return res.end();
});

app.get('/simulator/:id', (req, res) => {

    res.sendFile(__dirname + '/public/simulator.html');
});

app.post('/upload', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    let configData = JSON.parse(sampleFile.data);

    let url = "http://localhost:8081/process"; //url till backend

    const getInfo = async () => {
        let res = await axios.post(url, configData)
        console.log(res.data);
        popup.alert(JSON.stringify(res.data));
        console.log("klar");
        return res.data;
    }

    getInfo();
    
    res.redirect('/simulator');

});

app.listen(8000, () => console.log('node server started on port 8000'));