const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('hello world!');
    
});

app.listen(8000, () => console.log('on 8000 is upp!'));