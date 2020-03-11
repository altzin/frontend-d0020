const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const axios = require('axios');
const popup = require('node-popup');



// förbereder för statiska filer, uploads och diverse
app.use(fileUpload());
app.use(express.static('public'));


// get-route för hemsidan. Bör göras om.
app.get('/', (req, res) => {

    
    res.sendFile(__dirname + '/public/tester.html');

});

app.get('/simulator', (req, res) => {
    //var id = req.params.id; // /:id..med en templating engine kommer det här bli supersmidigt. vägen dit är nog krånglig. använd pug.



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

    //postar data som laddats in av användaren till backend och returnerar simulations id.
    const postData = async () => {
        let res = await axios.post(url, configData)
        console.log(res.data);
        popup.alert("Dina filer har skapats. \nDu kan nu gå till visualization, din simulering heter: " + res.data.simulationID);
        console.log("klar");
        return res.data;
    }

    postData();

    res.redirect('/');


});

app.listen(8000, () => console.log('node server started on port 8000'));