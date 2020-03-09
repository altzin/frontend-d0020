const axios = require('axios')


async function postFileData(data) {

    let url = "http://localhost:8081/process";

    let res = await axios.post(url,data);

    console.log(res.data);
    
}




//postFileData();



